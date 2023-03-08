import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(serchCauntries, DEBOUNCE_DELAY));

function serchCauntries(e) {
  const country = e.target.value.trim();
  if (country === '') {
    return clearPage();
  }

  fetchCountries(country)
    .then(renderPage)
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function renderPage(countries) {
  clearPage();
  if (countries.length === 1) {
    showCountrysInfo(countries);
  } else if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length > 1 && countries.length < 10) {
    showCountrysList(countries);
  }
}

function showCountrysList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class='item'>      
      <img src="${flags.svg}" alt="${flags.alt}" width = 30 height = 30/>
      <p>${name.official}</p>
      </li>`;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function showCountrysInfo(countries) {
  const markup = countries
    .map(({ name, flags, capital, population, languages }) => {
      return `
      <div class='info'>  
        <img src="${flags.svg}" alt="${flags.alt}" width = 30 height = 30/>
        <h1>${name.official}</h1>
      </div>
      <div>
        <p><span>Capital:</span> ${capital}</p>
        <p><span>Population:</span> ${population}</p>
        <p><span>Languages:</span> ${Object.values(languages).join(', ')}</p>
      </div>`;
    })
    .join('');

  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clearPage() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
