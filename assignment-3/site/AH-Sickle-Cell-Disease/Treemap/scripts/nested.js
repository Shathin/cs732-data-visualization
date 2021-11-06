import { screen, margin, nestedViz, legendConfig } from "./config.js";
import { legend } from "../../../utils/legend.js";
import { uid } from "../../../utils/uid.js";

/**
 * A convienience object to map the attribute to the depth in the treemap
 */
const order = {
  0: "Dataset",
  1: "Year",
  2: "Quarter",
  3: "Age Group",
  4: "Race or Hispanic Origin",
};

const dataTooltip = (d) =>
  d
    .ancestors()
    .reverse()
    .map((d) => ({ value: d.data[0], height: d.height, depth: d.depth }))
    .map((d) => `${order[d.depth]}: ${d.value}`)
    .join("\n");

export const nested = (svg, data, valueField) => {
  console.log("Building a Nested Treemap");

  // Re-align view box according to current visualization
  svg.attr("viewBox", [
    nestedViz.minX,
    nestedViz.minY,
    screen.width,
    screen.height,
  ]);

  // Convert the Flat Dataset into a grouped data set.
  // Each level is grouped by a different attribute
  const groupedData = d3.group(
    data,
    (d) => d["Year"],
    (d) => d["Quarter"],
    (d) => d["Age Group"],
    (d) => d["Race or Hispanic Origin"]
  );

  // Creates a nested data structured from the above grouped data
  const hierarchy = d3
    .hierarchy(groupedData)
    .sum((d) => d[valueField])
    .sort((a, b) => b[valueField] - a[valueField]);

  const treemap = d3
    .treemap()
    .tile(d3.treemapSquarify)
    .size([nestedViz.width, nestedViz.height])
    .paddingOuter(5)
    .paddingTop(30)
    .paddingInner(1)
    .round(true);

  const root = treemap(hierarchy);
  root.data[0] = "AH Sickle Cell Disease";
  console.log("Root =>", root);

  const color = d3.scaleSequential([10, 1], d3.interpolateMagma);
  const format = d3.format(",d");

  const shadow = uid("shadow");

  const group = svg.append("g");

  group
    .append("filter")
    .attr("id", shadow.id)
    .append("feDropShadow")
    .attr("flood-opacity", 0.3)
    .attr("dx", 0)
    .attr("stdDeviation", 3);

  const nodeData = d3.groups(root, (d) => d.height).filter((d) => d[0] > 0);
  console.log(nodeData);

  const node = group
    .selectAll("g")
    .data(nodeData)
    .join("g")
    .attr("filter", shadow)
    .selectAll("g")
    .data((d) => d[1])
    .join("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  // node.append("title").text(
  //   (d) =>
  //     `${d
  //       .ancestors()
  //       .reverse()
  //       .map((d) => d.data[0])
  //       .join("/")}\n${format(d.value)}`
  // );
  node
    .append("title")
    .text((d) => `${dataTooltip(d)}\n${valueField}: ${format(d.value)}`);

  node
    .append("rect")
    .attr("id", (d) => (d.nodeUid = uid("node")).id)
    .attr("fill", (d) => color(d.height))
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  node
    .append("clipPath")
    .attr("id", (d) => (d.clipUid = uid("clip")).id)
    .append("use")
    .attr("xlink:href", (d) => d.nodeUid.href);

  node
    .append("text")
    .attr("clip-path", (d) => d.clipUid)
    .selectAll("tspan")
    .data((d) => d.data[0].split().concat(format(d.value)))
    .join("tspan")
    .attr("fill-opacity", (d, i, nodes) =>
      i === nodes.length - 1 ? 0.7 : null
    )
    .attr("font-size", "12px")
    .text((d) => d);

  node
    .filter((d) => d.children)
    .selectAll("tspan")
    .attr("dx", 3)
    .attr("y", 13);

  node
    .filter((d) => !d.children)
    .selectAll("tspan")
    .attr("x", 3)
    .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 1.5 + 1.3}em`);

  const zoom = d3.zoom().on("zoom", (event) => {
    group.attr("transform", event.transform);
  });
  zoom(svg);
};
