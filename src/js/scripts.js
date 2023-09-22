// Importing the lunarphase-js library
import { Moon } from "/node_modules/lunarphase-js/dist/index.es.js";

// Openweathermap API. Do not share it publicly.
const api = '827709658b8e55763f327d65c79711a2';

// Set up Moon Phase Icons
let moonIcons = [];

// Fetch the moon icons from the JSON file
fetch('../json/moonIcons.json')
  .then(response => response.json())
  .then(data => {
    moonIcons = data;
    console.log("moonIcons:", moonIcons);
    // Initialize moon icon
    updateMoonIcon();   
  })
  .catch(error => console.error('Error loading moon icons:', error));

// Initialize DOM elements for weather information display.
const iconImg = document.getElementById('weather-icon'); // iconImg: Element to display the current weather icon.
const loc = document.querySelector('#location'); // loc: Element to display the current location.
const tempC = document.querySelector('.c'); // tempC: Element to display temperature in Celsius.
const tempF = document.querySelector('.f'); // tempF: Element to display temperature in Fahrenheit.
const desc = document.querySelector('.desc'); // desc: Element to display the weather description.
const sunriseDOM = document.querySelector('.sunrise'); // sunriseDOM: Element to display the sunrise time.
const sunsetDOM = document.querySelector('.sunset'); // sunsetDOM: Element to display the sunset time.

// Initialize DOM elements for moon phase information display.
const moonIconImg = document.getElementById('moonIconImg');  // New element for moon icon image
const moonPhaseName = document.getElementById('moonPhaseName');  // New element for moon phase name

// Using lunarphase-js to get the lunar age percentage
function getCurrentMoonPhase() {
    return Moon.lunarAgePercent();
  }
  
  // Map the moon phase to one of your 28 icons
  function getMoonIcon(phase) {
    const index = Math.floor(phase * moonIcons.length);
    console.log("Phase:", phase, "Index:", index, "moonIcons Length:", moonIcons.length);
    return moonIcons[index].icon;
  }
  
  // Get moon phase name based on index
function getMoonPhaseName(phase) {
    const index = Math.floor(phase * moonIcons.length);
    return moonIcons[index].phase;  // Assuming 'name' exists in your moonIcons JSON
}

// Update HTML
function updateMoonIcon() {
    const phase = getCurrentMoonPhase();
    const icon = getMoonIcon(phase);
    const name = getMoonPhaseName(phase);
    
    const iconPath = `../../media/icons/moon-phases/${icon}.svg`;  // Update this based on your actual path
    moonIconImg.src = iconPath;  // Update the src attribute of the img tag
    moonPhaseName.textContent = name;  // Update the text content with the moon phase name
}

// Function to get weather data
window.addEventListener('load', () => {
    let long;
    let lat;
  // Accesing Geolocation of User
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
        // Storing Longitude and Latitude in variables
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;

        // Using fetch to get data
        fetch(base)
            .then((response) => {
            return response.json();
            })
            .then((data) => {
            const { temp } = data.main;
            const place = data.name;
            const { description, icon } = data.weather[0];
            const { sunrise, sunset } = data.sys;

            const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            const fahrenheit = (temp * 9) / 5 + 32;

            // Converting Epoch(Unix) time to GMT
            const sunriseGMT = new Date(sunrise * 1000);
            const sunsetGMT = new Date(sunset * 1000);

            // Interacting with DOM to show data
            iconImg.src = iconUrl;
            loc.textContent = `${place}`;
            desc.textContent = `${description}`;
            tempC.textContent = `${temp.toFixed(2)} °C`;
            tempF.textContent = `${fahrenheit.toFixed(2)} °F`;
            sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
            sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
            });
        });
    }
});