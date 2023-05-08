import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

let searchName = '';

function onInputSearch() {
  searchName = input.value.trim();

  if (searchName === '') {
    clearAll();
    return;
  }

  fetchCountries(searchName)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearAll();
      } else if (country.length >= 2 && country.length <= 10) {
        clearAll();
        renderCountryList(country);
      } else if (country.length === 1) {
        clearAll();
        renderCountryInfo(country);
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearAll() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryList(countries) {
  const markup = countries
    .map(elem => {
      return `
        <li class="list-item">
          <img src="${elem.flags.svg}" alt="Flag of ${elem.name.official}" width="70px">
          <p class="country-name">${elem.name.official}</p>
        </li>
      `;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(countries) {
  const elemArray = countries[0];
  const languageList = Object.values(elemArray.languages).join(',');

  const markup = `
      <img class="flag" src="${elemArray.flags.svg}" alt="Flag of ${elemArray.name.official}" width="250px">
      <h2 class="name">${elemArray.name.official}</h2>
      <p class="country-desc"><b>Capital:</b> ${elemArray.capital}</p>
      <p class="country-desc"><b>Population:</b> ${elemArray.population}</p>
      <p class="country-desc"><b>Languages:</b> ${languageList}</p>
  `;
  countryInfo.innerHTML = markup;
}
