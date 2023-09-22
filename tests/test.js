import fetch from 'node-fetch';
import dotenv from 'dotenv';
import readline from 'readline';
import { Moon } from "lunarphase-js";


dotenv.config(); // Load environment variables from .env file

// Function to get latitude and longitude from city name using Google Geocoding API
async function getCoordinates(cityName, country, targetTimeZone = '', localTimeZone = '') {  
  const apiKey = process.env.GOOGLE_API_KEY;
  const encodedCity = encodeURIComponent(cityName);

  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedCity},${country}&key=${apiKey}`;

  try {
    const response = await fetch(geocodingUrl);
    const data = await response.json();


    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      const cityCountry = data.results[0].formatted_address;

      const targetTimeZone = await getTimeZone(latitude, longitude);
      
      return { latitude, longitude, cityCountry, targetTimeZone, localTimeZone };
    } else {
      throw new Error('Geocoding API Error: ' + data.status);
    }
  } catch (error) {
    throw new Error('Error fetching geocoding data: ' + error.message);
  }
}

async function getTimeZone(latitude, longitude) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const timestamp = Math.round((new Date()).getTime() / 1000);
    
    const timeZoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${apiKey}`;
  
    try {
      const response = await fetch(timeZoneUrl);
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.timeZoneId;
      } else {
        throw new Error('Time Zone API Error: ' + data.status);
      }
    } catch (error) {
      throw new Error('Error fetching time zone data: ' + error.message);
    }
  }
  

// Function to get user input
async function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Function to get weather data using OpenWeather API
async function getWeatherData(latitude, longitude, units, cityCountry, targetTimeZone, localTimeZone) {  
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

  try {
    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (data.cod === 200) {
      const temperature = data.main.temp;
      const cityName = data.name;
      const sunriseTimeUTC = new Date(data.sys.sunrise * 1000);
      const sunsetTimeUTC = new Date(data.sys.sunset * 1000);

      // Check to see if targetTimeZone and localTimeZone are correct
      console.log(targetTimeZone, localTimeZone);
      
      // Convert UTC sunrise and sunset times to the local time of the target city
      const localSunriseTime = new Intl.DateTimeFormat('en-US', {
        timeZone: targetTimeZone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(sunriseTimeUTC);

      const localSunsetTime = new Intl.DateTimeFormat('en-US', {
        timeZone: targetTimeZone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(sunsetTimeUTC);

      // Get the current local time in your time zone
      const currentLocalTime = new Intl.DateTimeFormat('en-US', {
        timeZone: localTimeZone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }).format(new Date());

        // Get moon phase information
      const phase = Moon.lunarPhase();
      const phaseEmoji = Moon.lunarPhaseEmoji();

      console.log('\n============================================================');
      console.log(`City: ${cityName}`);
      console.log(`Country: ${cityCountry}`);
      console.log(`Date: ${new Date().toLocaleDateString()}`);
      console.log(`Local Time: ${currentLocalTime}`);
      console.log(`Temperature: ${temperature}°${units === 'imperial' ? 'F' : 'C'}`);
      console.log(`Sunrise (${cityName} Time): ${localSunriseTime}`);
      console.log(`Sunset (${cityName}): ${localSunsetTime}`);
      console.log(`Moon Phase: ${phase} | ${phaseEmoji}`);
      console.log('============================================================\n');
    } else {
      throw new Error('OpenWeather API Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error fetching weather data: ' + error.message);
  }
}

// Main function to fetch and display weather data
async function fetchAndDisplayWeather(cityName, units, cityCountry, targetTimeZone, localTimeZone) {
    try {
      const { latitude, longitude } = await getCoordinates(cityName);
      await getWeatherData(latitude, longitude, units, cityCountry, targetTimeZone, localTimeZone);
    } catch (error) {
      console.error(error.message);
    }
  }

// Use user input for city name and units
async function main() {
  console.log('\n============================================================');console.log('Welcome to the Weather App!');
  const city = await getUserInput('Enter the city name: ');
  const units = await getUserInput('Select units (metric (°C) /imperial (°F)): ');

// Dynamically fetch local time zone using Intl.DateTimeFormat
const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Fetch the coordinates and time zones
const { latitude, longitude, cityCountry, targetTimeZone } = await getCoordinates(city);

fetchAndDisplayWeather(city, units, cityCountry, targetTimeZone, localTimeZone);
}

// Call the main function
main();
