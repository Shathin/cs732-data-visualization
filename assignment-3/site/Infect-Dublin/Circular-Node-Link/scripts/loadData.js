/**
 * Loads the data contained at the URL specified and returns an object representation of it
 * @param {String} url URL pointing to the data 
 * @returns {Object} Data read from the specified URL 
 */
export const loadData = async (url) => {
  const localStorageKey = 'infect-dublin';
  try {

    let rawData = window.localStorage.getItem(localStorageKey);

    if (!rawData) {
      console.log("Fetching data over the network!");
      rawData = await d3.text(url);
      window.localStorage.setItem(localStorageKey, rawData);
    } else {
      console.log("Fetching data from the local storage!");
    }


    const data = {
      'nodes': [],
      'links': []
    };

    d3.dsvFormat(" ").parse(rawData, d => {
      // Convert each item to a number 
      d.person = +d.person;
      d.proximity = +d.proximity;

      // Add data to links
      data.links.push({
        'source': d.person,
        'target': d.proximity
      });

      // Add data to nodes
      const personIndex = data.nodes.findIndex(n => n.person === d.person)
      if (personIndex === -1) {
        data.nodes.push({
          person: d.person
        });
      }
      const proximityIndex = data.nodes.findIndex(n => n.person === d.proximity);
      if (proximityIndex === -1) {
        data.nodes.push({
          person: d.proximity
        });
      }

      return d;
    });

    for (let iter = 0; iter < data.nodes.length; iter++) {
      const node = data.nodes[iter];
      data.nodes[iter] = node;

      const incomingLinks = data.links.filter(link => link.target === node.person).length;
      const outgoingLinks = data.links.filter(link => link.source === node.person).length;

      node['incoming'] = incomingLinks;
      node["outgoing"] = outgoingLinks;
      node['links'] = incomingLinks + outgoingLinks;

    }

    if (!Array.isArray(data.nodes) && data.nodes.length === 0)
      throw new Error("No node data found! ⚠️");
    else if (!Array.isArray(data.links) && data.links.length === 0)
      throw new Error("No links data found! ⚠️");


    return data;
  } catch (error) {
    console.error("Error while loading CSV Data ⚠️", error.message)
    console.error(error);
    return null;
  } finally {
    console.log("Data loading process complete! ✅")
  }
}