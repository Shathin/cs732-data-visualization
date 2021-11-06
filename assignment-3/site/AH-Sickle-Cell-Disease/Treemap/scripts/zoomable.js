import { screen, zoomableViz, legendConfig } from "./config.js";
import { legend } from "../../../utils/legend.js";

/**
 * Custom Tiling function by Mike Bostock (Creator of D3)
 */
const tile = (node, x0, y0, x1, y1) => {
  d3.treemapSquarify(node, 0, 20, zoomableViz.width, zoomableViz.height);
  for (const child of node.children) {
    child.x0 = x0 + (child.x0 / zoomableViz.width) * (x1 - x0);
    child.x1 = x0 + (child.x1 / zoomableViz.width) * (x1 - x0);
    child.y0 = y0 + (child.y0 / zoomableViz.height) * (y1 - y0);
    child.y1 = y0 + (child.y1 / zoomableViz.height) * (y1 - y0);
  }
};

/**
 * A convienience object to map the attribute to the depth in the treemap
 */
const order = {
  0: "Year-Quarter", // Top level
  1: "Age Group", // 2nd level
  2: "Race or Hispanic Origin", // 3rd level
};

/**
 * Creates breadcrumbs of values based on the user's position in the treemap
 *
 * @returns {String} Breadcrumbs
 */
const valueCrumbs = (d) =>
  d
    .ancestors()
    .reverse()
    .map((d) => d.data[0])
    .filter((d) => d) // Remove empty entries
    .join(" / ");

/**
 * Creates breadcrumbs of attribute names based on the user's position in the treemap
 *
 * @returns {String} Breadcrumbs
 */
const attributeCrumbs = (d) =>
  d
    .ancestors()
    .reverse()
    .map((d) => order[d.depth] || "")
    .join(" / ");

const dataTooltip = (d) =>
  d
    .ancestors()
    .reverse()
    .map((d) => ({ value: d.data[0], height: d.height, depth: d.depth }))
    .filter((d) => d.depth > 0)
    .map((d) => `${order[d.depth - 1]}: ${d.value}`)
    .join("\n");

// Entry Point
export const zoomable = (svg, data, valueField) => {
  console.log("Building a Zoomable Treemap");

  // Convert the Flat Dataset into a grouped data set.
  // Each level is grouped by a different attribute
  const groupedData = d3.group(
    data,
    (d) => (d["Year-Quarter"] = `${d["Year"]}-${d["Quarter"]}`),
    (d) => d["Age Group"],
    (d) => d["Race or Hispanic Origin"]
  );

  // Creates a nested data structured from the above grouped data
  const hierarchy = d3
    .hierarchy(groupedData)
    .sum((d) => d[valueField])
    .sort((a, b) => b[valueField] - a[valueField]);

  const treemap = d3.treemap().tile(tile)(hierarchy);

  const color = d3
    .scaleSequential()
    .interpolator((t) => d3.interpolateViridis(1 - t));

  /**
   * Provides a X & Y Scales for generating the position of the rectangles of the treemap
   */
  const scales = {
    x: d3.scaleLinear().rangeRound([0, zoomableViz.width]),
    y: d3.scaleLinear().rangeRound([0, zoomableViz.height]),
  };

  // Re-align view box according to current visualization
  svg.attr("viewBox", [
    zoomableViz.minX,
    zoomableViz.minY,
    screen.width,
    screen.height,
  ]);

  // Set the domain for the color scheme to be used
  color.domain([0, treemap.value]);

  let group = svg.append("g").call(render, treemap);

  legend({
    color: color,
    title: valueField,
    width: legendConfig.width,
    height: legendConfig.height,
    marginTop: legendConfig.marginTop,
    transform: `translate(${zoomableViz.width - legendConfig.width}, -${
      zoomableViz.paddingTop * 1.5
    })`,
  });

  function render(group, root) {
    const node = group
      .selectAll("g")
      .data(root.children.concat(root))
      .join("g");

    node
      .filter((d) => (d === root ? d.parent : d.children))
      .attr("cursor", "pointer")
      .on("click", (event, d) => (d === root ? zoomout(root) : zoomin(d)));

    node
      .append("title")
      .text((d) => `${dataTooltip(d)}\n${valueField}: ${d.value}`);

    node
      .append("rect")
      .attr("fill", (d) => (d === root ? "#fff" : color(d.value)))
      .attr("stroke", "#fff")
      .append("title")
      .text((d) => {
        let text = "";
        if (d === root) {
          if (d.data[0]) text = `Click to Zoom out of ${d.data[0]}`;
          else text = `You're at the top! You cannot zoom out!`;
        } else {
          text = `${dataTooltip(d)}\n${valueField}: ${d.value}`;

          if (d.height > 1) text += `\n\nClick to Zoom In to ${d.data[0]}`;
          else text += `\n\nCannot Zoom In anymore!`;
        }
        return text;
      });

    node
      .append("text")
      .style("font-weight", "bold")
      .selectAll("tspan")
      .data((d) => {
        if (d === root) {
          let text = `${attributeCrumbs(d)}`;
          if (valueCrumbs(d)) text += ` ➡️ ${valueCrumbs(d)}`;

          return text.split().concat(`Total in ${valueField}: ${d.value}`);
        } else return d.data[0].split().concat(d.value);
      })
      .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 1.5 + 1.3}em`)
      .style("font-size", "16px")
      .attr("font-weight", (d, i, nodes) =>
        i === nodes.length - 1 ? "normal" : null
      )
      .text((d) => d);

    group.call(position, root);
  }

  function position(group, root) {
    group
      .selectAll("g")
      .attr("transform", (d) =>
        d === root
          ? `translate(0, -30)`
          : `translate(${scales.x(d.x0)},${scales.y(d.y0)})`
      )
      .select("rect")
      .attr("width", (d) =>
        d === root ? zoomableViz.width : scales.x(d.x1) - scales.x(d.x0)
      )
      .attr("height", (d) =>
        d === root ? 30 : scales.y(d.y1) - scales.y(d.y0)
      );
  }

  function zoomin(d) {
    if (d.height === 1) return;

    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.append("g").call(render, d));

    scales.x.domain([d.x0, d.x1]);
    scales.y.domain([d.y0, d.y1]);

    svg
      .transition()
      .duration(1000)
      .call((t) => group0.transition(t).remove().call(position, d.parent))
      .call((t) =>
        group1
          .transition(t)
          .attrTween("opacity", () => d3.interpolate(0, 1))
          .call(position, d)
      );
  }

  function zoomout(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.insert("g", "*").call(render, d.parent));

    scales.x.domain([d.parent.x0, d.parent.x1]);
    scales.y.domain([d.parent.y0, d.parent.y1]);

    svg
      .transition()
      .duration(1000)
      .call((t) =>
        group0
          .transition(t)
          .remove()
          .attrTween("opacity", () => d3.interpolate(1, 0))
          .call(position, d)
      )
      .call((t) => group1.transition(t).call(position, d.parent));
  }
};
