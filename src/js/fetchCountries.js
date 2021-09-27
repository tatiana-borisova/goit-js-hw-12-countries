const BASE_URL = 'https://restcountries.com/v3';

function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}/name/${searchQuery}`).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error();
  });
}

export default { fetchCountries };
