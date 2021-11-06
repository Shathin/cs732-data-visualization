export const margin = {
  left: 40,
  top: 60,
  right: 10,
  bottom: 100
};

export const screen = {
  width: window.innerWidth - margin.left - margin.right,
  height: window.innerHeight - margin.top - margin.bottom,
  get centerX() {
    return (this.width - vizArea.side) / 2;
  },
  get centerY() {
    return (this.height - vizArea.side) / 2;
  }
};

export const vizArea = {
  side: Math.min(screen.width, screen.height) - 65
};

export const legendConfig = {
  width: 400,
  height: 50,
  marginTop: 10,
};