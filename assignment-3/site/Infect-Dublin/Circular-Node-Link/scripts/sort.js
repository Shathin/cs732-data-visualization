const d3 = window.d3;

/**
 * An object that helps sort the nodes based on the different parameters of a node
 */
export const sort = {
  /**
   * Returns a function which can be used for ordering the nodes based on the specified attribute. Ordering - Ascending
   * @param {String} attribute Defines the attribute to be used for ordering
   * @returns {Function} Ordering Function
   */
  ascending: (attribute) => {
    return (nodes) =>
      nodes
      .sort((a, b) => d3.ascending(a[attribute], b[attribute]));
  },
  get person() {
    return this.ascending("person");
  },
  get incoming() {
    return this.ascending("incoming");
  },
  get outgoing() {
    return this.ascending("outgoing");
  },
};