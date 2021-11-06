import { nodeConfig, linkConfig, arrow } from "./config.js";

/**
 *
 * @param {d3.Selection} link
 * @param {d3.Selection} node
 */
export const onMouseEnterNode = (link, node) => {
  return (event, d) => {
    const connectedNodes = [];

    link
      .attr("stroke-width", (l) => {
        if (d === l.source) {
          connectedNodes.push(l.target);
          return linkConfig.default.strokeWidth;
        } else if (d === l.target) {
          connectedNodes.push(l.source);
          return linkConfig.default.strokeWidth;
        }
        return linkConfig.onHoverDisconnected.strokeWidth;
      })
      .attr("stroke", (l) =>
        d === l.source
          ? linkConfig.onHover.outgoingLinkStroke
          : d === l.target
          ? linkConfig.onHover.incomingLinkStroke
          : linkConfig.default.stroke
      )
      .attr("marker-end", (l) =>
        d === l.source
          ? "url(#outgoingLinkArrow)"
          : d === l.target
          ? "url(#incomingLinkArrow)"
          : "url(#arrowDefault)"
      );

    node
      .attr("opacity", nodeConfig.onHoverDisconnected.opacity)
      .filter((n) => connectedNodes.indexOf(n) >= 0)
      .attr("opacity", nodeConfig.default.opacity);
    node.filter((n) => n === d).attr("opacity", nodeConfig.default.opacity);
  };
};

export const onMouseLeave = (link, node) => {
  return (event) => {
    link
      .attr("stroke-width", linkConfig.default.strokeWidth)
      .attr("stroke", linkConfig.default.stroke)
      .attr("marker-end", "url(#arrowDefault)");
    node.attr("opacity", nodeConfig.default.opacity);
  };
};

export const onMouseEnterLink = (link, node) => {
  return (event, d) => {
    const connectedNodes = [d.source, d.target];

    link
      .attr("stroke-width", (l) =>
        d === l
          ? linkConfig.default.strokeWidth
          : linkConfig.onHoverDisconnected.strokeWidth
      )
      .attr("stroke", (l) =>
        l.source === connectedNodes[0] || l.target === connectedNodes[0]
          ? linkConfig.onHover.incomingLinkStroke
          : linkConfig.default.stroke
      )
      .attr("marker-end", (l) =>
        l.source === connectedNodes[0] || l.target === connectedNodes[0]
          ? "url(#incomingLinkArrow)"
          : "url(#arrowDefault)"
      );

    node
      .attr("opacity", nodeConfig.onHoverDisconnected.opacity)
      .filter((n) => connectedNodes.indexOf(n) >= 0)
      .attr("opacity", nodeConfig.default.opacity);
  };
};

export const dragStarted = (simulation) => {
  return (event) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  };
};

export const dragged = (event) => {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
};

export const dragEnded = (simulation) => {
  return (event) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  };
};

export const zoom = (group) => {
  return d3.zoom().on("zoom", (event) => {
    group.attr("transform", event.transform);
  });
};
