import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function clear() {
    list.innerHTML = '';
    info.innerHTML = '';
};

function searchCountry(e) {
    const findCountry = e.target.value.trim();
    if (!findCountry) {
        clear();
        return;
    };

    fetchCountries(findCountry)
        .then(country => {
            if (country.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                clear();
                return;
            } else if (country.length === 1) {
                clear(list.innerHTML);
                getInfo(country);
            } else if ((country.length >= 2) && (country.length <= 10)) {
                clear(info.innerHTML);
                getCountry(country);
            };
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name.');
            clear();
            return error;
        });
};

function getCountry(country) {
    const content = country
        .map(({ name, flags }) => {
            return `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60">${name.official}</li>`;
        })
        .join('');
    list.innerHTML = content;
};

function getInfo(country) {
    const contentInfo = country
        .map(({ name, capital, population, flags, languages }) => {
            return `<h1><img src="${flags.svg}" alt="${name.official
                }" width="100" height="60">${name.official}</h1>
                <p><span>Capital: </span>${capital}</p>
                <p><span>Population:</span> ${population}</p>
                <p><span>Languages:</span> ${Object.values(languages)}</p>`;
        })
        .join('');
    info.innerHTML = contentInfo;
};