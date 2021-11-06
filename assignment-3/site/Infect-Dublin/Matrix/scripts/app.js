import { loadData } from "./loadData.js";
import { visualize } from "./visualize.js";

/** Displays a message when the data loading process has failed due to some error */
const DataError = `<div id="data-error">
  <h1>
    Error while loading the data! 
    <span role="img" aria-label="sad-cat-emoji">😿</span>
  </h1>
  <p>
    Check the Chrome Dev Tools console for the error message! ⚠️
  </p>
</div>`;

const App = async () => {
  const app = document.getElementById("app");

  // * Load the data
  const url =
    "https://gist.githubusercontent.com/Shathin/66f8fd50d517792c98c1c645ecbae46f/raw/infect-dublin.edges";
  const data = await loadData(url);

  if (!data) app.innerHTML = DataError;
  else {
    console.log(data);
    visualize(app, data);
  }
};

window.onload = App;
