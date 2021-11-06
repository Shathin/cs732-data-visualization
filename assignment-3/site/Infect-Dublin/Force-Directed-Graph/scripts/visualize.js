import {
  margin,
  screen,
  forceConfig,
  nodeConfig,
  linkConfig,
  arrow,
  legendConfig
} from "./config.js";

import {
  onMouseEnterNode,
  onMouseLeave,
  onMouseEnterLink,
  dragStarted,
  dragged,
  dragEnded,
  zoom
} from "./interactions.js";

import {
  legend
} from "../../../utils/legend.js";


const scales = {
  colorScale: (nodes) => {
    return d3
      .scaleSequential()
      .domain(nodes)
      .interpolator(d3.interpolateViridis);
  },
  radiusScale: (data) => {
    return d3
      .scaleLinear()
      .domain(d3.extent(data.nodes, (d) => d.links))
      .range([nodeConfig.default.minRadius, nodeConfig.default.maxRadius]);
  }
};

const createElements = (data, simulation) => {
  const svg = d3
    .create("svg")
    .attr("height", screen.height)
    .attr("width", screen.width);

  const group = svg.append("g");

  const {
    colorScale,
    radiusScale
  } = scales;

  zoom(group)(svg);

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

  const link = group
    .append("g")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke", linkConfig.default.stroke)
    .attr("stroke-width", linkConfig.default.strokeWidth)
    .attr("marker-end", "url(#arrowDefault)");

  link.append("title").text((d) => `${d.source} → ${d.target}`);

  const node = group
    .append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => radiusScale(data)(d.links))
    .attr("fill", (d) => colorScale([1, data.nodes.length])(d.person))
    .attr("stroke", nodeConfig.default.stroke)
    .attr("stroke-width", nodeConfig.default.strokeWidth);

  node
    .append("title")
    .text(
      (d) =>
      `Person: ${d.person}\nIncoming Links: ${d.incomingLinks}\nOutgoing Links: ${d.outgoingLinks}\nTotal links: ${d.links}`
    );

  const drag = d3
    .drag()
    .on("start", dragStarted(simulation))
    .on("drag", dragged)
    .on("end", dragEnded(simulation));

  link
    .on("mouseenter", onMouseEnterLink(link, node))
    .on("mouseleave", onMouseLeave(link, node));

  node
    .on("mouseenter", onMouseEnterNode(link, node))
    .on("mouseleave", onMouseLeave(link, node))
    .call(drag);

  return {
    svg,
    group,
    link,
    node
  };
};

const updateSimulation = (simulation, data, link, node) => {
  // Update simulation according to config
  simulation
    .force("link")
    .id((d) => d.person)
    .distance(forceConfig.link.distance)
    .links(data.links);

  simulation
    .force("charge")
    .strength(forceConfig.charge.strength)
    .distanceMin(forceConfig.charge.distanceMin)
    .distanceMax(forceConfig.charge.distanceMax);

  simulation
    .force("collide")
    .strength(forceConfig.collide.strength)
    .radius(forceConfig.collide.radius);

  simulation
    .force("center")
    .x(screen.width * forceConfig.center.x)
    .y(screen.height * forceConfig.center.y);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  simulation.alpha(1).restart();
};

/**
 * Deals with rendering the visualization
 * @param {HTMLElement} app Reference to the `app` div
 * @param {Array<Object>} data Data to be visualized
 */
export const visualize = (app, data) => {
  const simulation = d3
    .forceSimulation()
    .nodes(data.nodes)
    .force("link", d3.forceLink())
    .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide())
    .force("center", d3.forceCenter());

  const {
    svg,
    link,
    node
  } = createElements(data, simulation);

  updateSimulation(simulation, data, link, node);

  // Handle Window Resizing
  d3.select(window).on("resize", () => {
    // Get new screen size
    screen.width = window.innerWidth - margin.left - margin.right;
    screen.height = window.innerHeight - margin.top - margin.bottom;

    svg.attr("width", screen.width).attr("height", screen.height);
    updateSimulation(simulation, data, link, node);
  });

  app.append(svg.node());

  legend({
    color: scales.colorScale([1, data.nodes.length]),
    title: "Person",
    width: legendConfig.width,
    height: legendConfig.height,
    marginTop: legendConfig.marginTop,
  });
};