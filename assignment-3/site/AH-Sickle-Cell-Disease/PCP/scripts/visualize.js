import {
  margin,
  screen,
  brush,
  legendConfig
} from "./config.js";
import {
  scales,
  getYScales,
  getXScale
} from "./scales.js";
import {
  generators
} from "./generators.js";
import {
  brushStart,
  brushing,
  dragStart,
  dragging,
  dragEnd,
} from "./interactions.js";
import {
  legend
} from "../../../utils/legend.js";

const {
  width,
  height
} = screen;

// Adding this to make the code editor ignore the error of `d3 is not defined`
const d3 = window.d3;

// Columns - Race or Hispanic Origin", "Age Group", "SCD_Underlying", "SCD_Multi", "SCD and COVID-19", "Death Year-Quarter"
const columns = {
  discreteCol: ["Race or Hispanic Origin", "Age Group", "Death Year-Quarter"],
  continuousCol: ["SCD_Underlying", "SCD_Multi", "SCD and COVID-19"]
};
const columnsArr = [].concat.apply([], Object.values(columns)); // Converting to an array for convenience

let yScales, xScale;


const render = (data, svg, axis, colorAxis) => {
  console.log("Rendering PCP with", colorAxis, "as the axis being for the color scheme!");

  // Remove the lines, brush & the legend (if they exist) before rendering 
  d3.select(".lines").remove();
  d3.select(".legend").remove();
  d3.selectAll(".brush").remove();

  const dragSelection = {}; // Stores the current position of the axis being dragged
  const brushSelection = new Map(); // Contains the selected regions in each axis

  const color = scales.colorScale(yScales, colorAxis, columns);

  const line = generators.line(yScales, xScale, columnsArr, dragSelection);

  const path = svg
    .append("g")
    .attr("class", "lines")
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.7)
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("d", line)
    .attr("stroke", (d) => color(d[colorAxis]));

  // Enable dragging of the axis
  const drag = d3
    .drag()
    .subject((d) => ({
      x: xScale(d)
    }))
    .on("start", dragStart(dragSelection, xScale))
    .on("drag", dragging(dragSelection, columnsArr, xScale, axis, path, line))
    .on("end", dragEnd(dragSelection, xScale, path, line));
  axis.call(drag);

  // Creates a new one-dimensional brush along the y-dimension - https://github.com/d3/d3-brush
  const brushY = d3
    .brushY()
    .extent([
      [-brush.width / 2, margin.top],
      [brush.width / 2, height - margin.bottom]
    ])
    .on("start", brushStart)
    .on(
      "brush end",
      brushing(svg, path, yScales, brushSelection, (d) =>
        color(d[colorAxis])
      )
    );

  // Enable brushing
  axis
    .append("g")
    .attr("class", "brush")
    .each(function (d) {
      d3.select(this).call(brushY);
    })
    .selectAll("rect")
    .attr("x", -25)
    .attr("width", 50)
    .append("title")
    .text("Click and drag to start brushing!");

  axis.append("title").text("Click and drag to reorder axes");

  legend({
    color: color,
    title: colorAxis,
    width: legendConfig.width,
    height: legendConfig.height,
    marginTop: legendConfig.marginTop
  });
}

export const visualize = (app, data) => {

  yScales = getYScales(data, columns);
  xScale = getXScale(columns);

  const svg = d3.create("svg").attr("width", width).attr("height", height);
  app.append(svg.property("value", data).node());

  const axis = svg
    .append("g")
    .attr("class", "axes")
    .selectAll("g")
    .data(columnsArr)
    .join("g")
    .attr("class", "axis")
    .attr("transform", (d) => `translate(${xScale(d)})`);

  // Add Axis, Ticks & Title
  axis
    .append("g")
    .attr("class", "axis-ticks")
    .each(function (d) {
      return d3.select(this).call(d3.axisLeft(yScales.get(d)));
    })
    .each(function (d) {
      d3.select(this).style("font-size", "12px")
    })
    .append("text")
    .style("text-anchor", "middle")
    .attr("fill", "currentColor")
    .attr("y", margin.top - 10)
    .attr("font-weight", 600)
    .attr("font-size", "12px")
    .text((d) => d);

  render(data, svg, axis, "Race or Hispanic Origin");

  const colorAxisSelector = d3.select("select");

  colorAxisSelector.selectAll("option")
    .data(columnsArr)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  colorAxisSelector.on("change", function () {
    render(data, svg, axis, this.value);
  })
};