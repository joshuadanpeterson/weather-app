console.log("Script is running"); // To confirm the script is being loaded

// Replace this with your actual API key for testing
const key = "827709658b8e55763f327d65c79711a2";

let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cityRef = document.getElementById("searchInput");

searchBtn.addEventListener("click", function() {
  console.log("Button clicked"); // To confirm the event is firing
  
  let cityValue = cityRef.value;
  console.log(`City Value: ${cityValue}`); // To confirm the value is being read
  
  if (cityValue.length === 0) {
    result.innerHTML = `<h3 class="msg">Please enter a city name</h3>`;
    return;
  }
  
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
  console.log(`Fetching: ${url}`); // To confirm the URL
  
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data); // To see the data being returned
      result.innerHTML = `<h2>${data.name}</h2>`;
    })
    .catch((error) => {
      console.log(`Error: ${error}`); // To see any fetch errors
      result.innerHTML = `<h3 class="msg">City not found</h3>`;
    });
});
