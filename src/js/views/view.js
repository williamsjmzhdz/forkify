import icons from 'url:../../img/icons.svg'; // For icons inside dist/

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // Updates view data
    this._data = data;

    // Creates new markup based on the new data
    const newMarkup = this._generateMarkup();

    // Creates a virtual DOM (Object) from the markup (String)
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Creates an Array of all the elements in the virtual DOM (new elements)
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // Creates an Array of the current DOM elements
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Compare both arrays and update if an element is different
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
