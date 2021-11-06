export const margin = {
  left: 10,
  right: 10,
  top: 40,
  bottom: 60
};

export const screen = {
  width: window.innerWidth - margin.left - margin.right,
  height: window.innerHeight - margin.top - margin.bottom
};

export const forceConfig = {
  center: {
    x: 0.5,
    y: 0.4
  },
  charge: {
    strength: -20,
    distanceMin: 20,
    distanceMax: 600
  },
  collide: {
    strength: 1,
    radius: 5
  },
  link: {
    distance: 25
  }
};

export const linkConfig = {
  default: {
    stroke: "#777",
    strokeWidth: 0.5
  },
  onHover: {
    incomingLinkStroke: "#e41a1c",
    outgoingLinkStroke: "#4daf4a"
  },
  onHoverDisconnected: {
    strokeWidth: 0
  }
};

export const nodeConfig = {
  default: {
    minRadius: 2,
    maxRadius: 5,
    radius: 4,
    stroke: "#000",
    strokeWidth: 1,
    opacity: 1,
    maxOpacity: 0.75,
    minOpacity: 0.5
  },
  onHoverDisconnected: {
    opacity: 0.25
  }
};

export const arrow = {
  refX: 20,
  refY: 0,
  markerHeight: 6,
  markerWidth: 6,
  viewBox: "-0 -5 10 10",
  defaultFill: linkConfig.default.stroke,
  incomingLinkArrowFill: linkConfig.onHover.incomingLinkStroke,
  outgoingLinkArrowFill: linkConfig.onHover.outgoingLinkStroke
};

export const legendConfig = {
  width: 400,
  height: 50,
  marginTop: 10,
};