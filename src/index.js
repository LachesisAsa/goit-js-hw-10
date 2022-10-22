import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  listСountriesRef: document.querySelector('.country-list'),
  infoСountriesRef: document.querySelector('.country-info'),
};

refs.inputRef.addEventListener(
  'input',
  debounce(inputSearchCountryOn, DEBOUNCE_DELAY)
);

function inputSearchCountryOn(evt) {
  const inputText = evt.target.value;
  const valueNormalized = inputText.trim().toLowerCase();

  if (valueNormalized === '') {
    refs.listСountriesRef.innerHTML = '';
    refs.infoСountriesRef.innerHTML = '';
    return;
  } else {
    fetchCountries(valueNormalized)
      .then(countries => {
        const findCountry = countries.filter(({ name: { official } }) =>
          official.toLowerCase().includes(valueNormalized)
        );

        if (findCountry.length > 10) {
          refs.listСountriesRef.innerHTML = '';
          refs.infoСountriesRef.innerHTML = '';
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        if (findCountry.length > 1 && findCountry.length <= 10) {
          const markupListCountries = createListCountries(findCountry);
          refs.listСountriesRef.innerHTML = markupListCountries;
          refs.infoСountriesRef.innerHTML = '';
          return;
        }

        if (findCountry.length === 1) {
          const markupOneCountry = createCountryInfo(findCountry[0]);
          refs.infoСountriesRef.innerHTML = markupOneCountry;
          refs.listСountriesRef.innerHTML = '';
          return;
        }

        if (findCountry.length === 0) {
          refs.listСountriesRef.innerHTML = '';
          refs.infoСountriesRef.innerHTML = '';
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}

function createListCountries(countries) {
  return countries
    .map(
      ({ name: { official }, flags: { svg } }) => `<li class="list__item">
  		<img src="${svg}" alt="${official}" width="30" height="30"/>
  		<p>${official}</p></li>`
    )
    .join('');
}

function createCountryInfo({
  flags: { svg },
  name: { official },
  capital,
  population,
  languages,
}) {
  const languagesCountries = Object.values(languages).join(', ');
  return `<div class=""info__item>
  <div class="block-img"><img src="${svg}" alt="${official}" width="30"/>
  <h2>${official}</h2></div>
  		 <p><b>Capital:</b> ${capital}</p>
  		 <p><b>Population:</b> ${population}</p>
  		 <p><b>Languages:</b> ${languagesCountries}</p></div>`;
}