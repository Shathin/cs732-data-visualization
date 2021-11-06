import {
  circle,
  screen
} from "./config.js";

const d3 = window.d3;


export const scales = {
  color: (nodes) => {
    return d3
      .scaleSequential()
      .domain(nodes)
      .interpolator(d3.interpolateViridis);
  },
  x: d3
    .scaleLinear()
    .domain([0, 1])
    .range([circle.centerX, circle.centerX + circle.aRadius]),
  y: d3
    .scaleLinear()
    .domain([0, 1])
    .range([circle.centerY, circle.centerY + circle.bRadius])
};