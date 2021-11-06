// https://github.com/d3/d3-shape

// Adding this to make the code editor ignore the error of `d3 is not defined`
const d3 = window.d3;

/**
 * Defines the generators used in the visualization
 */
export const generators = {
  /**
   * Returns a D3 Line Generator
   * @param {Object<String, Function>} yScales An object mapping the field to its scale
   * @param {Function} xScale x-scale that maps the column (axis) to their position on the screen
   * @param {Array} columnsArr List of columns / fields
   * @param {Object} dragSelection Stores the current position of the axis being dragged
   */
  line: (yScales, xScale, columnsArr, dragSelection) => {
    const line = d3
      .line()
      .x(([field]) => dragSelection[field] || xScale(field))
      .y(([field, value]) => yScales.get(field)(value));

    return (d) => line(d3.cross(columnsArr, [d], (key, d) => [key, d[key]]));
  }
};
