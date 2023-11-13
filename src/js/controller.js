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

    // 1. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 2. Loading recipe
    await model.loadRecipe(id);

    // 3. Rendering recipe
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
    resultsView.render(model.getSearchResultsPage());

    //5. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //1. Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
