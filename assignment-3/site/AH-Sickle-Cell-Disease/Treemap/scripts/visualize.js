import { margin, screen, zoomableViz } from "./config.js";

const { width, height } = screen;

import { nested } from "./nested.js";

import { zoomable } from "./zoomable.js";

let ordinalColumns = [],
  linearColumns = [];
ordinalColumns = ["Race or Hispanic Origin", "Age Group", "Death Year-Quarter"];
linearColumns = ["SCD_Underlying", "SCD_Multi", "SCD and COVID-19"];

export const visualize = (app, data) => {
  // Columns - Race or Hispanic Origin", "Age Group", "SCD_Underlying", "SCD_Multi", "SCD and COVID-19", "Year", "Quarter"
  const columns = {
    discrete: ["Race or Hispanic Origin", "Age Group", "Year", "Quarter"],
    continuous: [
      "Total Deaths",
      "SCD_Underlying",
      "SCD_Multi",
      "SCD and COVID-19",
    ],
  };

  let selectedValueField = columns.continuous[0];
  let treemapType = "nested";

  const valueFieldSelector = d3.select("select");

  valueFieldSelector
    .selectAll("option")
    .data(columns.continuous)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  valueFieldSelector.on("change", function () {
    selectedValueField = this.value;
    render();
  });

  d3.selectAll("input[type=radio]").on("change", function () {
    treemapType = this.value;
    render();
  });

  function render() {
    // Clear SVG before rendering
    d3.select("#app").selectAll("svg").remove();

    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, screen.width, screen.height])
      .style("font", "16px sans-serif");

    app.append(svg.node());

    treemapType === "zoomable"
      ? zoomable(svg, [...data], selectedValueField)
      : treemapType === "nested"
      ? nested(svg, [...data], selectedValueField)
      : null;
  }

  render();

  // /*
  //   Columns -
  //   [
  //     "Race or Hispanic Origin",
  //     "Age Group",
  //     "SCD_Underlying",
  //     "SCD_Multi",
  //     "SCD and COVID-19",
  //     "Death Year-Quarter"
  //   ]
  // */
  // const columns = [...(ordinalColumns || []), ...(linearColumns || [])];

  // const nestedData = d3
  //   .group(
  //     data,
  //     d => d['Year'],
  //     d => d['Quarter'],
  //     d => d['Age Group'],
  //     // d => d['Race or Hispanic Origin'],
  //   )

  // const hierarchy = d3
  //   .hierarchy(nestedData)
  //   // .sum(d => d['SCD_Underlying'] + d['SCD and COVID-19'] + d['SCD_Multi']);
  //   .sum(d => d['Total Deaths'])

  // const treemap = d3.treemap().size([width, height])
  //   .paddingOuter(5)
  //   .paddingTop(30)
  //   .paddingInner(1)
  //   .round(true);

  // const root = treemap(hierarchy);
  // root.data[0] = "AH Sickle Disease";
  // console.log("Root =>", root);

  // const color = d3.scaleSequential([8, 0], d3.interpolateMagma)
  // const format = d3.format(",d");

  // const svg = d3
  //   .create("svg")
  //   .attr("height", height)
  //   .attr('width', width).style("font", "10px sans-serif");

  // const group = svg
  //   .append("g")
  //   .attr("transform", `translate(${margin.left}, ${ margin.top})`)

  // group.append("filter")
  //   .append("feDropShadow")
  //   .attr("flood-opacity", 0.3)
  //   .attr("dx", 0)
  //   .attr("stdDeviation", 3);

  // const nodeData = d3.group(root, d => d.height);
  // console.log("Node Data =>", nodeData);

  // const node = group.selectAll("g")
  //   .data(nodeData)
  //   .join("g")
  //   .selectAll("g")
  //   .data(d => d[1])
  //   .join("g")
  //   .attr("transform", d => `translate(${d.x0},${d.y0})`);

  // // TODO : Add <title>
  // node.append("title")
  //   .text(d => `${
  //     d
  //     .ancestors()
  //     .reverse()
  //     .map(d => {
  //       switch (d.depth) {
  //         case 0:
  //           return d.data[0];
  //         case 1:
  //           return `Year: ${d.data[0]}`;
  //         case 2:
  //           return `Quarter: ${d.data[0]}`;
  //         case 3:
  //           return `Age Group: ${d.data[0]}`;
  //         case 4:
  //           return `Total Deaths: ${d.data['Total Deaths']}`;
  //         default:
  //           return "";
  //       }
  //     }).join("\n")}`);

  // node.append("rect")
  //   .attr("fill", d => color(d.height))
  //   .attr("width", d => d.x1 - d.x0)
  //   .attr("height", d => d.y1 - d.y0);

  // // node.append("clipPath")
  // //   .attr("id", d => d.depth)
  // //   .append("use")
  // // // .attr("xlink:href", d => d.nodeUid.href);

  // node.append("text")
  //   // .attr("clip-path", d => d.depth)
  //   .selectAll("tspan")
  //   .data(d => {
  //     switch (d.depth) {
  //       case 0:
  //         return d.data[0];
  //       case 1:
  //         return d.data[0];
  //       case 2:
  //         return d.data[0];
  //       case 3:
  //         return d.data[0];
  //       case 4:
  //         return d.data['Total Deaths'];
  //       default:
  //         return "";
  //     }
  //   })
  //   .join("tspan")
  //   .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
  //   .text(d => d);

  // node
  //   .filter(d => d.children)
  //   .selectAll("tspan")
  //   .attr("y", 13);

  // // node
  // //   .filter(d => !d.children)
  // //   .selectAll("tspan")
  // //   .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`);
  // // Handle zooming
  // const zoom = d3.zoom().on("zoom", (event) => {
  //   group.attr("transform", event.transform);
  // });
  // zoom(svg);
};
