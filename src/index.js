import { debounce } from 'lodash';
import API from './js/fetchCountries';
import countryCardTpl from './templates/country.hbs';
import countryListTpl from './templates/country-list.hbs';
import refs from './js/refs.js';
import {
  alert,
  error,
  defaultModules,
} from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
defaultModules.set(PNotifyMobile, {});

refs.searchInput.addEventListener(
  'input',
  debounce(onSearch, 500),
);

function onSearch(e) {
  const searchQuery = e.target.value.trim();
  if (!searchQuery) {
    error({ text: 'Please, enter a country name' });
    return;
  }

  API.fetchCountries(searchQuery)
    .then(renderCountryCard)
    .catch(onFetchError)
    .finally(debounce(clearInput, 40000));
}

function renderCountryCard(country) {
  if (country.length === 1) {
    refs.cardEl.innerHTML = countryCardTpl(country);
  } else if (country.length > 1 && country.length < 11) {
    refs.cardEl.innerHTML = countryListTpl(country);
  } else if (country.length > 10) {
    alert({
      text: 'Too many matches. Please precise your request',
    });
  } else {
    throw country;
  }
}

function onFetchError(err) {
  if (err.status === 404) {
    error({
      text: 'No matches found, please enter a new query.',
    });
  }
}

function clearInput() {
  refs.searchInput.value = '';
}
