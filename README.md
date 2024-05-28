# Weather App

## Overview
This is an Express.js weather web application that fetches real-time weather data using the OpenWeatherMap API. The application displays current weather conditions for a specified location.

## Features
- Fetches current weather data from the OpenWeatherMap API.
- Displays weather information including temperature, humidity, wind speed, and weather description.
- Simple and user-friendly interface.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/jayantsingh-22/weather-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd weather-app
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage
1. Start the server:
   ```bash
   node server.js
   ```
2. Open your browser and navigate to `http://localhost:3000`.

## Configuration
- The application uses the OpenWeatherMap API. You need to obtain an API key from [OpenWeatherMap](https://openweathermap.org/api) and replace `YOUR_API_KEY` in the `server.js` file.

## Dependencies
- Express
- Axios (for making API requests)
- Node.js

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Live Demo
Check out the live demo [here](https://weather-data.onrender.com/).
