import { screen, legendConfig } from "./config.js";
import { legend } from "../../../utils/legend.js";

// Adding this to make the code editor ignore the error of `d3 is not defined`
const d3 = window.d3;

/**
 * Event executed when the axis brushing starts.
 *
 * This function stops the invocation of the dragging behavior when the brushing occurs
 * @param {BrushEvent} event
 */
export const brushStart = (event) => event.sourceEvent.stopPropagation();

/**
 * Handles 1-D Axis brushing
 * @param {*} svg A D3 selection of the `svg` element
 * @param {*} path A D3 selection of all the (data) lines in the visualization
 * @param {Object<String, Function>} yScales An object mapping the field to its scale
 * @param {*} selections Contains the selected regions in each axis
 * @param {Function} color Color Scale
 * @returns {Function} Event Handler
 */
export const brushing = (svg, path, yScales, selections, color) => {
  return (event, d) => {
    const { selection } = event;
    if (selection === null) selections.delete(d);
    else selections.set(d, selection.map(yScales.get(d).invert));

    const selected = [];

    path.each((d, i, nodes) => {
      const active = Array.from(selections).every(
        ([key, [min, max]]) => d[key] >= min && d[key] <= max
      );
      d3.select(nodes[i]).style("stroke", active ? color : "#fff");
      if (active) {
        d3.select(nodes[i]).raise();
        selected.push(d);
      }
    });
    svg.property("value", selected).dispatch("input");
  };
};

/**
 * Executed when the user initiates the dragging event
 * @param {Object} dragSelection Stores the current position of the axis being dragged
 * @param {Function} xScale x-scale that maps the column (axis) to their position on the screen
 */
export const dragStart = (dragSelection, xScale) => {
  return (event, d) => (dragSelection[d] = xScale(d));
};

/**
 * Event handler executed while the user is dragging the axis
 * @param {*} dragSelection Stores the current position of the axis being dragged
 * @param {*} columnsArr List of columns / fields
 * @param {*} xScale x-scale that maps the column (axis) to their position on the screen
 * @param {*} axis A D3 selection of all the axis in the visualization
 * @param {*} path A D3 selection of all the (data) lines in the visualization
 * @param {*} line Line generator
 */
export const dragging = (
  dragSelection,
  columnsArr,
  xScale,
  axis,
  path,
  line
) => {
  return (event, d) => {
    const position = (c) => dragSelection[c] || xScale(c);

    dragSelection[d] = Math.min(screen.width, Math.max(0, event.x));
    columnsArr.sort((a, b) => position(a) - position(b));
    xScale.domain(columnsArr);
    axis.attr("transform", (c) => `translate(${position(c)}, 0)`);
    path.attr("d", line);
  };
};

/**
 * Event handler executed when the user stops dragging the axis
 * @param {*} dragSelection Stores the current position of the axis being dragged
 * @param {*} xScale x-scale that maps the column (axis) to their position on the screen
 * @param {*} path A D3 selection of all the (data) lines in the visualization
 * @param {*} line Line generator
 */
export const dragEnd = (dragSelection, xScale, path, line) => {
  return function (event, d) {
    const transition = (g) => g.transition().duration(300);

    delete dragSelection[d];
    const targetAxis = d3.select(this);
    transition(targetAxis).attr("transform", `translate(${xScale(d)})`);
    transition(path.attr("d", line));
  };
};
