export const margin = {
  left: 40,
  top: 40,
  right: 10,
  bottom: 60
};

export const screen = {
  width: window.innerWidth - margin.left - margin.right,
  height: window.innerHeight - margin.top - margin.bottom,

};

export const nodeConfig = {
  default: {
    radius: 3,
    opacity: 1,
  },
  onHoverDisconnected: {
    opacity: 0.1
  }
}

export const linkConfig = {
  default: {
    stroke: "#777",
    strokeWidth: 0.5,
    opacity: 0.5,
  },
  onHover: {
    incomingLinkStroke: "#e41a1c",
    outgoingLinkStroke: "#4daf4a",
    opacity: 1,
  },
  onHoverDisconnected: {
    strokeWidth: 0,
    opacity: 0,
  }
}

export const circle = {
  padding: 20,
  centerX: screen.width / 2,
  centerY: screen.height / 2,
  get aRadius() {
    return screen.width / 2 - this.padding;
  },
  get bRadius() {
    return screen.height / 2 - this.padding;
  }
}

export const arrow = {
  refX: 20,
  refY: 0,
  markerHeight: 6,
  markerWidth: 6,
  viewBox: "-0 -5 10 10",
  defaultFill: linkConfig.default.stroke,
  incomingLinkArrowFill: linkConfig.onHover.incomingLinkStroke,
  outgoingLinkArrowFill: linkConfig.onHover.outgoingLinkStroke
}

export const legendConfig = {
  width: 400,
  height: 50,
  marginTop: 10,
};