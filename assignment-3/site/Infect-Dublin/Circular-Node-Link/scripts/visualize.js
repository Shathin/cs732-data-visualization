import {
  margin,
  screen,
  circle,
  nodeConfig,
  linkConfig,
  arrow,
  legendConfig
} from "./config.js";

import {
  scales
} from "./scales.js";

import {
  sort
} from "./sort.js";

import {
  onMouseEnterNode,
  onMouseLeave,
  onMouseEnterLink,
  zoom
} from "./interactions.js";

import {
  legend
} from "../../../utils/legend.js";

let numberOfNodes;

/**
 * Converts the node's index to angle 
 * Helps place the nodes in a circle
 * @param {Number} index 
 * @returns {Number} Angle for a node
 */
const indexToRad = (index) => 2 * Math.PI * index / numberOfNodes;

const createElements = (data) => {
  const {
    links,
    nodes
  } = data;

  const colorScale = scales.color([1, nodes.length]);

  const svg = d3
    .create("svg")
    .attr("width", screen.width)
    .attr('height', screen.height);

  const group = svg.append("g");

  zoom(group)(svg);

  // Create arrows
  group
    .append("defs")
    .selectAll("marker")
    .data(["arrowDefault", "incomingLinkArrow", "outgoingLinkArrow"])
    .enter()
    .append("marker")
    .attr("id", String)
    .attr("viewBox", arrow.viewBox)
    .attr("refX", arrow.refX)
    .attr("refY", arrow.refY)
    .attr("markerWidth", arrow.markerWidth)
    .attr("markerHeight", arrow.markerHeight)
    .attr("orient", "auto")
    .attr("fill", (d) =>
      d === "incomingLinkArrow" ?
      arrow.incomingLinkArrowFill :
      "outgoingLinkArrow" ?
      arrow.outgoingLinkArrowFill :
      arrow.defaultFill
    )
    .style("stroke", "none")
    .append("path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5");

  // Create Edges / Links
  const link = group
    .append("g")
    .attr("class", "links")
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", linkConfig.default.stroke)
    .attr("stroke-width", linkConfig.default.strokeWidth)
    .attr("opacity", linkConfig.default.opacity)
    .attr("marker-end", "url(#arrowDefault)");

  // Add text on hover
  link.append("title").text((d) => `${d.source.person} → ${d.target.person}`)

  // Create nodes - circles
  const node = group
    .append("g")
    .attr("class", "nodes")
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("id", d => `person-${d.person}`)
    .attr("r", nodeConfig.default.radius)
    .attr("opacity", nodeConfig.default.opacity)
    .style("fill", d => colorScale(d.person));

  // Add text on hover
  node
    .append("title")
    .text(
      (d) =>
      `Person: ${d.person}\nIncoming Links: ${d.incoming}\nOutgoing Links: ${d.outgoing}\nTotal links: ${d.links}`
    );

  link
    .on("mouseenter", onMouseEnterLink(link, node))
    .on("mouseleave", onMouseLeave(link, node));

  node
    .on("mouseenter", onMouseEnterNode(link, node))
    .on("mouseleave", onMouseLeave(link, node))

  return {
    svg,
    group,
    link,
    node
  }
}


const updateElements = (link, node) => {
  link.attr("x1", d => scales.x(Math.sin(indexToRad(d.source.index))))
    .attr("x2", d => scales.x(Math.sin(indexToRad(d.target.index))))
    .attr("y1", d => scales.y(Math.cos(indexToRad(d.source.index))))
    .attr("y2", d => scales.y(Math.cos(indexToRad(d.target.index))))
  node
    .attr("cx", (d, i) => scales.x(Math.sin(indexToRad(i))))
    .attr("cy", (d, i) => scales.y(Math.cos(indexToRad(i))))
}

const createSimulation = (data) => {
  const {
    links,
    nodes
  } = data;

  const simulation = d3
    .forceSimulation()
    .nodes(nodes)
    .force("link", d3.forceLink());

  simulation
    .force("link")
    .id(d => d.person)
    .links(links);

  return simulation;
}

export const visualize = (app, data) => {

  const {
    links,
    nodes
  } = data;

  sort.person(nodes);
  // sort.incoming(nodes);
  // sort.outgoing(nodes);

  numberOfNodes = nodes.length;

  const simulation = createSimulation(data);

  const {
    svg,
    group,
    link,
    node
  } = createElements(data);


  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  updateElements(link, node);

  simulation.stop();

  app.append(svg.node());

  legend({
    color: scales.color([1, nodes.length]),
    title: "Person",
    width: legendConfig.width,
    height: legendConfig.height,
    marginTop: legendConfig.marginTop,
  });


}