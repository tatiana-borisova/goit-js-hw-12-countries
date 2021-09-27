import { debounce } from 'lodash';
import API from './js/fetchCountries';
import countryCardTpl from './templates/country.hbs';
import countryListTpl from './templates/country-list.hbs';
import refs from './js/refs.js';
import { alert, error, defaultModules } from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
defaultModules.set(PNotifyMobile, {});

refs.searchInput.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  const searchQuery = e.target.value.trim();
  if (!searchQuery) return;

  API.fetchCountries(searchQuery).then(renderCountryCard).catch(onFetchError);
}

function renderCountryCard(countries) {
  if (countries.length === 1) {
    refs.cardEl.innerHTML = countryCardTpl(countries);
  } else if (countries.length > 1 && countries.length <= 10) {
    handleListRendering(countries);
  } else if (countries.length > 10) {
    alert({
      text: 'Too many matches. Please precise your request',
    });
  } else {
    throw countries;
  }
}

function handleListRendering(countries) {
  refs.cardEl.innerHTML = countryListTpl(countries);
  const countryList = document.querySelector('.country-list');
  countryList.addEventListener('click', onListClick);
}

function onListClick(e) {
  e.preventDefault();

  if (!e.target.classList.contains('country-list__link')) {
    return;
  }

  API.fetchCountries(e.target.textContent)
    .then(renderCountryCard)
    .catch(onFetchError);

  refs.searchInput.value = e.target.textContent;
}

function onFetchError() {
  error({
    text: 'No matches found, please enter a new query.',
  });
}
