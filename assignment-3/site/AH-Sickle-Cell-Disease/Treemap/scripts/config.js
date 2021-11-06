export const margin = {
  left: 20,
  top: 60,
  right: 20,
  bottom: 60,
};

export const screen = {
  width: window.innerWidth - margin.left - margin.right,
  height: window.innerHeight - margin.top - margin.bottom,
};

export const zoomableViz = {
  width: screen.width * 0.95,
  height: screen.height * 0.85,
  paddingTop: 60,
  get minY() {
    return -(screen.height - this.height) / 2 - this.paddingTop;
  },
  get minX() {
    return -(screen.width - this.width) / 2;
  },
};

export const nestedViz = {
  width: screen.width * 0.95,
  height: screen.height * 0.95,
  paddingTop: 10,
  get minY() {
    return -(screen.height - this.height) / 2 - this.paddingTop;
  },
  get minX() {
    return -(screen.width - this.width) / 2;
  },
};

export const legendConfig = {
  width: 400,
  height: 60,
  marginTop: 10,
};
