let countryInput = document.getElementById('countryInput');
let resultContainer = document.getElementById('result');
const APIURL = 'https://restcountries.com/v3.1/name/';

document.getElementById('searchBtn').addEventListener('click', searchCountry)

function searchCountry() {
    let countryName = countryInput.value.trim().toLowerCase();
    if (!countryName || countryName === '') {
        showerror('Add country name');
        return;
    }
    countryInput.value = '';

    fetchCountryDetails(countryName);
}
countryInput.addEventListener('keyup', (e) => {
    // console.log(e.key);
    if (e.key === 'Enter') {
        searchCountry();
    }
});

async function fetchCountryDetails(countryName) {
    let overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.classList.add('position');
        overlay.innerHTML = '<div class="loader"></div>';

    }
    try {
        let response = await fetch(`${APIURL}${countryName}`);
        if (!response.ok) {
            throw new Error('Country not found');
        }
        let data = await response.json();
        console.log(data);
        showDataToUser(data);
    } catch (error) {
        console.error('An error occurred: ' + error.message);
        showerror('Enter a valid country name');
    } finally {
        if (overlay) {
            overlay.classList.remove('position');
            overlay.classList.add('hide');
        }
    }
}

function showDataToUser(data) {
    resultContainer.innerHTML = '';
    let countryDetails = data[0];
    let countryName = countryDetails.name.common;
    let population = countryDetails.population;
    let region = countryDetails.region;
    let flag = countryDetails.flags.png;
    let flagALt = countryDetails.flags.alt;
    let languages = Object.values(countryDetails.languages).join(', ');
    let capital = countryDetails.capital ? countryDetails.capital[0] : 'No Capital';
    let currencyKey = Object.keys(countryDetails.currencies)[0];
    let currencyName = countryDetails.currencies[currencyKey].name;
    let currencySymbol = countryDetails.currencies[currencyKey].symbol;

    resultContainer.innerHTML = `
        <h2>Country Name: <span>${countryName}</span></h2>
        <img src="${flag}" alt="${flagALt}">
        <div class="country-details">
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Currency:</strong> ${currencyName} <strong>Symbol:</strong> ${currencySymbol}</p>
            <p><strong>Capital:</strong> ${capital}</p>
        </div>
    `;
}

function showerror(message) {
    let overlay = document.querySelector('.overlay');
    resultContainer.innerHTML = '';
    let error = document.createElement('span');
    error.classList.add('error');
    error.textContent = message;
    resultContainer.appendChild(error);
    overlay.classList.remove('position');
    overlay.classList.add('hide');
}
