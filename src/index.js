import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const DEBOUNCE_DELAY = 300;

const refs = {
    inputField: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.inputField.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    clearMarkup();

    const countryForSearch = e.target.value.trim();
    
    if (!countryForSearch) {
        return;
    }
    
    fetchCountries(countryForSearch)
        .then(renderMarkup)
        .catch(() => {
            Notify.failure('Oops, there is no country with that name')
        });
}

function renderMarkup(countries) {
    if (countries.length > 1 && countries.length <= 10) {
        const markup = countries.map((country) => {
                return `<li class="list-item item">
                    <img class="icon" src=${country.flags.svg} alt="" width="30px"/>
                    <span>${country.name.common}</span>
                </li>`;
        }).join("");
        refs.countryList.innerHTML = markup;
    } else if (countries.length === 1) {
        refs.countryInfo.innerHTML = 
            `<div>
                <div class="item">
                    <img class="icon" src=${countries[0].flags.svg} alt="" width="30px"/>
                    <span class="official-name">${countries[0].name.official}</span>
                </div>

                <p><span class="fields-name">Capital: </span>${countries[0].capital}</p>
                <p><span class="fields-name">Population: </span>${countries[0].population}</p>
                <p><span class="fields-name">Languages: </span>${Object.values(countries[0].languages)}</p>                
            </div>`;
    } else {
        Notify.info('Too many matches found. Please enter a more specific name');        
    }
}

function clearMarkup() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
}