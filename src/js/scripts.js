
// Importing the lunarphase-js library
import { Moon } from "/node_modules/lunarphase-js/dist/index.es.js";

// Openweathermap API. Do not share it publicly.
const api = '827709658b8e55763f327d65c79711a2';


// Set up Moon Phase Icons and Image List
let moonIcons = [];
let imageList = {};

// Fetch the moon icons and the image lists from the JSON files
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}

async function initializeData() {
  try {
    [moonIcons, imageList] = await Promise.all([
      fetchData('../json/moonIcons.json'),
      fetchData('../json/imageList.json')
    ]);
    console.log("moonIcons:", moonIcons);
    updateMoonIcon();
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

initializeData();

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
window.addEventListener('load', async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { longitude: long, latitude: lat } = position.coords;
      const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;
      
      try {
        const data = await fetchData(base);
        // ... (The rest of the code where you update the DOM remains the same)
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
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        });
      }
    });
