// Importing the lunarphase-js library
import { Moon } from "/node_modules/lunarphase-js/dist/index.es.js";

// Openweathermap API. Do not share it publicly.
const api = '827709658b8e55763f327d65c79711a2';

// Set up Moon Phase Icons and Image List
let moonIcons = [];
let imageList = {};

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

// Fetch the image list from the JSON file
fetch('../json/imageList.json')
  .then(response => response.json())
  .then(data => {
    imageList = data;
  })
  .catch(error => console.error('Error loading image list:', error));

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

const imageList = {
  "thunderstorm with light rain":"/media/imgs/storm.jpg",
  "thunderstorm with rain":"/media/imgs/storm.jpg",
  "thunderstorm with heavy rain":"/media/imgs/storm.jpg",
  "light thunderstorm":"/media/imgs/storm.jpg",
  "thunderstorm":"/media/imgs/storm.jpg",
  "heavy thunderstorm":"/media/imgs/storm.jpg",
  "ragged thunderstorm":"/media/imgs/storm.jpg",
  "thunderstorm with light drizzle":"/media/imgs/storm.jpg",
  "thunderstorm with drizzle":"/media/imgs/storm.jpg",
  "thunderstorm with heavy drizzle":"/media/imgs/storm.jpg",
  "light intensity drizzle":"/media/imgs/rain.jpg",
  "drizzle":"/media/imgs/rain.jpg",
  "heavy intensity drizzle":"/media/imgs/rain.jpg",
  "light intensity drizzle rain":"/media/imgs/rain.jpg",
  "drizzle rain":"/media/imgs/rain.jpg",
  "heavy intensity drizzle rain":"/media/imgs/rain.jpg",
  "shower rain and drizzle":"/media/imgs/rain.jpg",
  "heavy shower rain and drizzle":"/media/imgs/rain.jpg",
  "shower drizzle":"/media/imgs/rain.jpg",
  "light rain":"/media/imgs/rain.jpg",
  "moderate rain":"/media/imgs/rain.jpg",
  "heavy intensity rain":"/media/imgs/rain.jpg",
  "very heavy rain":"/media/imgs/rain.jpg",
  "extreme rain":"/media/imgs/rain.jpg",
  "freezing rain":"/media/imgs/rain.jpg",
  "light intensity shower rain":"/media/imgs/rain.jpg",
  "shower rain":"/media/imgs/rain.jpg",
  "heavy intensity shower rain":"/media/imgs/rain.jpg",
  "ragged shower rain":"/media/imgs/rain.jpg",
  "light snow":"/media/imgs/snow.jpg",
  "snow":"/media/imgs/snow.jpg",
  "heavy snow":"/media/imgs/snow.jpg",
  "sleet":"/media/imgs/snow.jpg",
  "light shower sleet":"/media/imgs/snow.jpg",
  "shower sleet":"/media/imgs/snow.jpg",
  "light rain and snow":"/media/imgs/snow.jpg",
  "rain and snow":"/media/imgs/snow.jpg",
  "light shower snow":"/media/imgs/snow.jpg",
  "shower snow":"/media/imgs/snow.jpg",
  "heavy shower snow":"/media/imgs/snow.jpg",
  "mist":"/media/imgs/fog.jpg",
  "fog":"/media/imgs/fog.jpg",
  "haze":"/media/imgs/fog.jpg",
  "smoke":"/media/imgs/ash.jpg",
  "sand/dust whirls":"/media/imgs/ash.jpg",
  "sand":"/media/imgs/ash.jpg",
  "dust":"/media/imgs/ash.jpg",
  "volcanic ash":"/media/imgs/ash.jpg",
  "haze":"/media/imgs/dust.jpg",
  "squalls":"/media/imgs/rain.jpg",
  "tornado":"/media/imgs/tornado.jpg",
  "clear sky":"/media/imgs/sun.jpg",
  "few clouds: 11-25%":"/media/imgs/partly_cloudy.jpg",
  "scattered clouds: 25-50%":"/media/imgs/partly_cloudy.jpg",
  "broken clouds: 51-84%":"/media/imgs/partly_cloudy.jpg",
  "overcast clouds: 85-100%":"/media/imgs/cloudy.jpg"
};

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

            // Debug Logs
            console.log('imageList:', imageList);
            console.log('description:', description);

            // This is for background image lookup & DOM update
            // Find matching image source in imageList
            const matchingImage = imageList.find(item => item.description === description);

            if (matchingImage) {  
                const imageFile = matchingImage.source;
                document.body.style.backgroundImage = `url(${imageFile})`;
            } else {
                // If no matching image found, use default image
                const defaultImage = 'media/imgs/alamanc.jpg'
                document.body.style.backgroundImage = `url(${defaultImage})`;
                console.error("Description not found in image list or image list is not populated");
            }

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