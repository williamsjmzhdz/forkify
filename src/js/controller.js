import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// import icons from '../img/icons.svg'; // Parcel 1
import 'core-js/stable'; // For polyfilling everything else
import 'regenerator-runtime/runtime'; // For polyfilling async await
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // Guard clause
    if (!id) return;

    recipeView.renderSpinner();

    // 1. Loading recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1. Display spinner
    resultsView.renderSpinner();

    //2. Get search query
    const query = searchView.getQuery();

    //3. Load search results
    await model.loadSearchResults(query);

    //4. Render results
    resultsView.render(model.getSearchResultsPage(3));

    //5. Render initial pagination buttons
    console.log(model.state);
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
