# Weather App

![Weather App Screenshot](/mockups/project_mockup_1.png)

## Overview

The Weather App is an engaging and informative web application that provides real-time weather updates for locations around the world. It offers a visually appealing experience with dynamic background images and icons that change according to the weather conditions. This project was developed by **Ev Fitzgerald Dixon, Jennifer Saffell, Josh Peterson, and Yoro Diakite** as part of a Nucamp JavaScript Fundamentals portfolio project.

## Features

- **Dynamic Background Images:** The app features background images that change according to the weather conditions, creating an immersive visual experience. These images are standardized across cities but adapt to the current weather.

- **Weather Icons:** Weather icons complement the background images, providing users with at-a-glance information about the current conditions.

- **Geolocation:** By default, the app uses the browser's geolocation feature to determine the user's location. This eliminates the need for users to manually input their city.

- **City Search:** Users can also search for specific cities using the search bar located above the weather icon. This feature enables users to check weather information for locations of their choice.

- **Moon Phases:** The app displays moon phases below sunrise and sunset times, enhancing its informative value.

- **Optional Features:**
  - **Site Introduction:** Upon the first launch of the site, users are greeted with the site's name, logo, and engaging animations, providing an enjoyable user experience.
  - **Moon Phases API:** The app leverages the OpenWeather API to incorporate accurate moon phase information, adding an extra layer of detail for enthusiasts.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- A modern web browser (Google Chrome, Mozilla Firefox, etc.).
- An internet connection to fetch weather data.

### Installation

1. Clone this GitHub repository to your local machine:
   

   ```shell
   git clone https://github.com/joshuadanpeterson/weather-app.git
   ```

2. Open the project folder in your code editor of choice (e.g., Visual Studio Code, Sublime Text).

3. Launch the `index.html` file in your web browser to run the Weather App.

### Usage

1. Upon opening the Weather App, your default city will be assumed using your browser's geolocation. Alternatively, you can use the search bar to specify a different city.

2. The app will display current weather conditions for the selected location, complete with dynamic background images and icons.

3. Moon phases are visible below sunrise and sunset times, providing additional celestial information.

## Contributing

We welcome contributions from the community. If you would like to contribute to this project, please follow these steps:

1. Fork the project on GitHub.

2. Create a new branch with a descriptive name for your feature or bug fix.

3. Make your changes and commit them with clear and concise messages.

4. Push your changes to your forked repository.

5. Submit a pull request to the main repository, explaining the changes you made.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or suggestions, feel free to contact us on Discord:

- [@Yoro Diakite](https://discordapp.com/users/1028176732584415253)
- [@Ev Fitzgerald Dixon](https://discordapp.com/users/897744571663011841)
- [@Josh Peterson](https://discordapp.com/users/350498460446752779)
- [@Jennifer Saffell](https://discordapp.com/users/1126942283598671912)

## Acknowledgments

- Special thanks to [OpenWeather](https://openweathermap.org/api) for providing weather data and [Google Cloud API](https://console.cloud.google.com/) for providing geocoding and time zone data.
- Icons and images used in this project are sourced:
  - [Weather Icons](https://erikflowers.github.io/weather-icons/): for weather icons
  - [Pixabay](https://pixabay.com/images/search/weather/): for background images



## API Setup

### OpenWeather API

1. Visit [OpenWeather](https://openweathermap.org/api) and sign up for an API key.
2. After obtaining the API key, add it to your `.env` file (create one if it doesn't exist).

    ```env
    OPENWEATHER_API_KEY=your_openweather_api_key_here
    ```

### Google Cloud APIs

1. Visit [Google Cloud Console](https://console.cloud.google.com/) and enable the Geocoding API and Time Zone API for your project.
2. Obtain an API key and add it to your `.env` file.

    ```env
    GOOGLE_API_KEY=your_google_api_key_here
    ```

## Environment Setup

1. Create a `.env` file in the `tests` directory.
2. Add your API keys to the `.env` file as shown above.

## Dependency Installation

1. Open a terminal and navigate to the `tests` directory.
2. Run `npm install` to install the required Node.js packages.

## Running the Node.js Test

1. Open a terminal and navigate to the `tests` directory.
2. Run `npm start` to execute the `test.js` script.

> Note: The `test.js` script will be renamed to `main.js` in future versions.

