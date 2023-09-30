// Importing the lunarphase-js library
import { Moon } from "/node_modules/lunarphase-js/dist/index.es.js";

document.addEventListener("DOMContentLoaded", async function () {
  console.log("Script is running");

  // Openweathermap API Key
  const api = '827709658b8e55763f327d65c79711a2';

  // Initialize DOM elements for weather information
  // In HTML: <img id="weather-icon" src="" alt="">
  const iconImg = document.getElementById('weather-icon');
  // In HTML: <span id="location"></span>
  const loc = document.getElementById('location');
  // In HTML: <span class="c"></span>
  const tempC = document.querySelector('.c');
  // In HTML: <span class="f"></span>
  const tempF = document.querySelector('.f');
  // In HTML: <span class="desc"></span>
  const desc = document.querySelector('.desc');
  // In HTML: <span class="sunrise"></span>
  const sunriseDOM = document.querySelector('.sunrise');
  // In HTML: <span class="sunset"></span>
  const sunsetDOM = document.querySelector('.sunset');

  // Initialize DOM elements for moon information
  // In HTML: <img id="moonIconImg" src="" alt="">
  const moonIconImg = document.getElementById('moonIconImg');
  // In HTML: <span id="moonPhaseName"></span>
  const moonPhaseName = document.getElementById('moonPhaseName');

  // Initialize moonIcons and imageList
  let moonIcons = [];
  let imageList = [];

  // Fetch Data
  async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
  }

  // Initialize Data
  async function initializeData() {
    try {
      [moonIcons, imageList] = await Promise.all([
        fetchData('../json/moonIcons.json'),
        fetchData('../json/imageList.json')
      ]);
      console.log("moonIcons:", moonIcons);
      console.log("imageList:", imageList);
      updateMoonIcon();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  await initializeData();

  // Get the current moon phase
  function getCurrentMoonPhase() {
    return Moon.lunarAgePercent();
  }

  // Update Moon Icon
  function updateMoonIcon() {
    const phase = getCurrentMoonPhase();
    const icon = moonIcons[Math.floor(phase * moonIcons.length)].icon;
    const name = moonIcons[Math.floor(phase * moonIcons.length)].phase;

    moonIconImg.src = `../../media/icons/moon-phases/${icon}.svg`;
    moonPhaseName.textContent = name;
  }

  // Get weather data
  async function getWeather(latitude = null, longitude = null, cityValue = "") {
    let url = "";
    if (latitude && longitude) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}&units=metric`;
    } else if (cityValue) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${api}&units=metric`;
    } else {
      return;
    }
    
    // Get background image based on weather data
    try {
        const data = await fetchData(url);
        const { description } = data.weather[0];
  
        // Debug Logs
        console.log('imageList:', imageList);
        console.log('description:', description);
  
        // Background image lookup & DOM update
        const matchingImage = imageList.find(item => item.description === description);
        if (matchingImage) {
          const imageFile = matchingImage.source;
          document.body.style.backgroundImage = `url(${imageFile})`;
        } else {
          const defaultImage = 'media/imgs/alamanc.jpg';
          document.body.style.backgroundImage = `url(${defaultImage})`;
          console.error("Description not found in image list or image list is not populated");
        }

        // Get timezone offset from the API and convert it to milliseconds
        const timezoneOffsetMillis = data.timezone * 1000;

        // Get local browser's timezone offset in milliseconds
        const localOffsetMillis = new Date().getTimezoneOffset() * 60 * -1000;

        // Calculate the actual local time of the target city for sunrise and sunset
        const sunriseLocalTime = new Date((data.sys.sunrise * 1000) + timezoneOffsetMillis - localOffsetMillis).toLocaleTimeString();
        const sunsetLocalTime = new Date((data.sys.sunset * 1000) + timezoneOffsetMillis - localOffsetMillis).toLocaleTimeString();

        // Update DOM elements for sunrise and sunset
        sunriseDOM.textContent = sunriseLocalTime;
        sunsetDOM.textContent = sunsetLocalTime;

        // Example: updating iconImg, loc, tempC, tempF, etc.
        iconImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        loc.textContent = `${data.name}, ${data.sys.country}`;
        tempC.textContent = `${data.main.temp.toFixed(2)} °C`;
        tempF.textContent = `${((data.main.temp * 9) / 5 + 32).toFixed(2)} °F`;
        desc.textContent = `${data.weather[0].description}`;

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  // Event Listener for the search button
  // In HTML: <button id="search-btn">Search</button>
  const searchBtn = document.getElementById('search-btn');
  // In HTML: <input id="searchInput" type="text">
  const cityRef = document.getElementById('searchInput');

  searchBtn.addEventListener("click", () => getWeather(null, null, cityRef.value));

  // Fetch weather data based on geolocation
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;
    getWeather(latitude, longitude);
  }, () => {
    // In HTML: <div id="result"></div>
    document.getElementById('result').innerHTML = "<h3 class='msg'>Permission denied. Could not get location.</h3>";
  });
});