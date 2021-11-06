// Adding this to make the code editor ignore the error of `d3 is not defined`
const d3 = window.d3;

export const loadData = async (url) => {
  const localStorageKey = "ah-sickle-cell-disease";

  try {
    // Using Local Storage to reduce network calls
    let rawData = window.localStorage.getItem(localStorageKey);
    if (!rawData) {
      console.log("Fetching data over the network!");

      rawData = await d3.text(url);
      window.localStorage.setItem(localStorageKey, rawData);
    } else console.log("Fetching the data from the local storage!");

    const data = d3.csvParse(rawData, (d) => {
      // Combine Year & Quarter
      d["Death Year-Quarter"] = `${d["Date of Death Year"]}-Q${d["Quarter"]}`;

      // Hack to fix incorrect sorting of age group
      if (d["Age Group"] === "5-14 years") d["Age Group"] = "05-14 years";
      else if (d["Age Group"] === "<5 years") d["Age Group"] = "0-5 years";

      // Convert to numbers
      d["SCD_Underlying"] = +d["SCD_Underlying"];
      d["SCD_Multi"] = +d["SCD_Multi"];
      d["SCD and COVID-19"] = +d["SCD and COVID-19"];

      // Clean up
      delete d["Data as of"];
      delete d["Date of Death Year"];
      delete d["Quarter"];

      return d;
    });

    return data;
  } catch (error) {
    console.error("Error while loading CSV Data ⚠️", error.message);
    console.error(error);
    return null;
  } finally {
    console.log("Data loading process complete! ✅");
  }

  // let rawData = JSON.parse(window.localStorage.getItem(localStorageKey));

  // if (!rawData) {
  //   try {
  //     rawData = await d3.csv(url, (d) => {
  //       // Combine Year & Quarter
  //       d["Death Year-Quarter"] = `${d["Date of Death Year"]}-Q${d["Quarter"]}`;

  //       // Convert to numbers
  //       d["SCD_Underlying"] = +d["SCD_Underlying"];
  //       d["SCD_Multi"] = +d["SCD_Multi"];
  //       d["SCD and COVID-19"] = +d["SCD and COVID-19"];

  //       // Clean up
  //       delete d["Data as of"];
  //       delete d["Date of Death Year"];
  //       delete d["Quarter"];

  //       return d;
  //     });
  //     delete rawData.columns;
  //   } catch (error) {
  //     console.error("Error while loading CSV Data ⚠️", error.message);
  //     console.error(error);
  //     return null;
  //   }

  //   window.localStorage.setItem(localStorageKey, JSON.stringify(rawData));
  // }

  // return rawData;
};
