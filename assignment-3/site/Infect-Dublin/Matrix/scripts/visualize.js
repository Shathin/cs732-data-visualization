import { margin, screen, vizArea, legendConfig } from "./config.js";

import { legend } from "../../../utils/legend.js";

const d3 = window.d3;

const order = {
  ascending: (attribute) => {
    return (nodes) => {
      const array = Array.from(nodes.keys());
      return array.sort(
        (a, b) => nodes.get(a)[attribute] - nodes.get(b)[attribute]
      );
    };
  },
  get person() {
    return this.ascending("person");
  },
  get incoming() {
    return this.ascending("incoming");
  },
  get outgoing() {
    return this.ascending("outgoing");
  },
  get total() {
    return this.ascending("total");
  },
};

const scales = {
  x: d3.scaleBand().range([0, vizArea.side]),
  y: d3.scaleBand().range([0, vizArea.side]),
  color: (nodes) => {
    return d3
      .scaleSequential()
      .domain(nodes)
      .interpolator(d3.interpolateSinebow);
  },
};

export const visualize = (app, data) => {
  const { matrix, nodes } = data;

  let sourceNodes = order["person"](nodes);
  let targetNodes = order["person"](nodes);

  scales.x.domain(targetNodes);
  scales.y.domain(sourceNodes);
  const color = scales.color([1, Array.from(nodes.keys()).length]);

  const svg = d3
    .create("svg")
    .attr("viewBox", [
      -screen.centerX,
      -screen.centerY,
      screen.width,
      screen.height,
    ]);

  const group = svg.append("g");

  group
    .append("rect")
    .attr("width", vizArea.side)
    .attr("height", vizArea.side)
    .attr("stroke", "none")
    .attr("stroke-width", 0)
    .attr("fill", "#000");

  const grid = group.append("g").attr("class", "grid");

  const rectangles = grid
    .selectAll("rect")
    .data(matrix)
    .enter()
    .append("rect")
    .attr("x", (d, i) => scales.x(d[1].target))
    .attr("y", (d, i) => scales.y(d[1].source))
    .attr("width", scales.x.bandwidth())
    .attr("height", scales.y.bandwidth())
    .attr("stroke", "none")
    .attr("stroke-width", 0)
    .attr("fill", (d) => color(d[1].source));

  rectangles.append("title").text((d) => {
    const target = nodes.get(d[1].target);
    const source = nodes.get(d[1].source);

    return `
    ${source.person} → ${target.person}
  =======
  Source: ${source.person}
  \tIncoming: ${source.incoming}
  \tOutgoing: ${source.outgoing}
  \tTotal: ${source.total}
  =======
  Target: ${target.person}
  \tIncoming: ${target.incoming}
  \tOutgoing: ${target.outgoing}
  \tTotal: ${target.total}
    `;
  });

  // Handle zooming
  const zoom = d3.zoom().on("zoom", (event) => {
    group.attr("transform", event.transform);
  });
  zoom(svg);

  d3.select("#source-select").on("change", function () {
    sourceNodes = order[this.value](nodes);

    scales.y.domain(sourceNodes);

    rectangles
      .transition()
      .duration(3000)
      .attr("y", (d, i) => scales.y(d[1].source));
  });
  d3.select("#target-select").on("change", function () {
    targetNodes = order[this.value](nodes);

    scales.x.domain(targetNodes);

    rectangles
      .transition()
      .duration(3000)
      .attr("x", (d, i) => scales.x(d[1].target));
  });

  group
    .append("text")
    .attr("class", "label")
    .attr("transform", `translate(${vizArea.side / 2 - 50}, ${-20})`)
    .style("font-size", 18)
    .style("color", "#777")
    .text("← Target (Person) →")
    .on("dblclick", (event) => {
      event.stopPropagation();
      rectangles
        .transition()
        .duration(1000)
        .attr("fill", (d) => color(d[1].target));
    })
    .append("title")
    .text("Double Click to use this axis for the color scale");

  group
    .append("text")
    .attr("class", "label")
    .attr(
      "transform",
      `translate(${-20}, ${vizArea.side / 2 + 50}) rotate(-90)`
    )
    .style("font-size", 18)
    .style("color", "#777")
    .text("← Source (Person) →")
    .on("dblclick", (event) => {
      event.stopPropagation();
      rectangles
        .transition()
        .duration(1000)
        .attr("fill", (d) => color(d[1].source));
    })
    .append("title")
    .text("Double Click to use this axis for the color scale");

  app.append(svg.node());

  legend({
    color: color,
    title: "Person",
    width: legendConfig.width,
    height: legendConfig.height,
    marginTop: legendConfig.marginTop,
    transform: `translate(${vizArea.side + 8 * margin.right}, 0)`,
  });
};
