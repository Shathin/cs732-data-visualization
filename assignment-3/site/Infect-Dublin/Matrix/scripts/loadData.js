// Adding this to make the code editor ignore the error of `d3 is not defined`
const d3 = window.d3;

/**
 * Loads the data contained at the URL specified and returns an object representation of it
 * @param {String} url URL pointing to the data
 * @returns {Object} Data read from the specified URL
 */
export const loadData = async (url) => {
  const localStorageKey = "infect-dublin";

  try {
    // Using Local Storage to reduce network calls
    let rawData = window.localStorage.getItem(localStorageKey);
    if (!rawData) {
      console.log("Fetching data over the network!");

      rawData = await d3.text(url);
      window.localStorage.setItem(localStorageKey, rawData);
    } else console.log("Fetching the data from the local storage!");

    let data = d3.dsvFormat(" ").parse(rawData, d => {
      d['person'] = +d['person'];
      d['proximity'] = +d['proximity'];
      return d;
    });
    delete data.columns;

    const numberOfNodes = 410;
    const nodes = new Map();
    for (let iter = 0; iter < numberOfNodes; iter++) {
      nodes.set(iter + 1, {
        person: iter + 1,
        outgoing: 0,
        incoming: 0,
        get total() {
          return this.incoming + this.outgoing;
        }
      });
    }

    const nodeKey = (source, target) => `${source}:${target}`;

    const matrix = new Map();
    data.forEach(d => {
      matrix.set(nodeKey(d.person, d.proximity), {
        source: d.person,
        target: d.proximity,
      });
      nodes.get(d.person).outgoing += 1
      nodes.get(d.proximity).incoming += 1
    });

    return {
      raw: data,
      matrix,
      nodes
    };
  } catch (error) {
    console.error("Error while loading CSV Data ⚠️", error.message);
    console.error(error);
    return null;
  } finally {
    console.log("Data loading process complete! ✅");
  }
};