// https://github.com/d3/d3-scale
// https://github.com/d3/d3-scale-chromatic

import {
  margin,
  screen
} from "./config.js";

// Adding this to make the code editor ignore the error of `d3 is not defined`
const d3 = window.d3;
const {
  width,
  height
} = screen;

/**
 * Defines two scales - Discrete and Continuous Scales
 */
export const scales = {
  /**
   * Returns a Discrete Scale for the specified categorical/ordinal field
   * @param {Array<Object>} data The data used for visualization
   * @param {String} field The field for which the scale is to be assigned
   */
  discreteScale: (data, field) => {
    // Fetch the unique items from the specified field
    const domain = data.reduce((reduced, row) => {
      if (!reduced.includes(row[field])) reduced.push(row[field]);
      return reduced;
    }, []);

    domain.sort();

    const scale = d3
      .scalePoint()
      .domain(domain)
      .range([margin.top, height - margin.bottom])
      .padding(0.5);

    // Custom invert function
    scale.invert = (() => {
      const domain = scale.domain();
      const range = scale.range();

      const invertedScale = d3.scaleQuantize().domain(range).range(domain);

      return (y) => invertedScale(y);
    })();

    return scale;
  },
  /**
   * Returns a Continuous Scale for the specified numerical field
   * @param {Array<Object>} data The data used for visualization
   * @param {String} field The field for which the scale is to be assigned
   */
  continousScale: (data, field) => {
    return d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[field]))
      .range([margin.top, height - margin.bottom])
      .nice();
  },
  colorScale: (yScales, field, columns) => {
    if (
      Array.isArray(columns.discreteCol) &&
      columns.discreteCol.includes(field)
    ) {
      return d3.scaleOrdinal(yScales.get(field).domain(), d3.schemeCategory10);
    } else {
      return d3.scaleSequential(yScales.get(field).domain(), (t) =>
        d3.interpolateViridis(1 - t)
      );
    }
  }
};

/**
 * Returns an object mapping the scale to the column.
 * @param {Array<Object>} data The data used for visualization
 * @param {{"discreteCol": Array<String>, "continuousCol": Array<String>}} columns Columns in the data grouped by type of column i.e., discrete (ordinal / categorical) & continuous (numerical)
 * @returns {Map}
 */
export const getYScales = (data, columns) => {
  const yScales = {};

  (columns.discreteCol || []).forEach(
    (field) => (yScales[field] = scales.discreteScale(data, field))
  );

  (columns.continuousCol || []).forEach(
    (field) => (yScales[field] = scales.continousScale(data, field))
  );

  return new Map(Object.entries(yScales));
};

/**
 * Returns the x scale that maps the column (axis) to their position on the screen
 * @param {{"discreteCol": Array<String>, "continuousCol": Array<String>}} columns Columns in the data grouped by type of column i.e., discrete (ordinal / categorical) & continuous (numerical)
 */
export const getXScale = (columns) => {
  return d3
    .scalePoint()
    .domain([...(columns.discreteCol || []), ...(columns.continuousCol || [])])
    .range([6 * margin.left, width - margin.right * 3]);
};