const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const fs = require("fs");
const jsdom = require("jsdom");
require("dotenv").config();

const app = express();

app.use(express());
app.use(
  express.static(__dirname + "/public", {
    index: false,
    immutable: true,
    cacheControl: true,
    maxAge: "30d",
  })
);
app.use(express.static("public"));

const { JSDOM } = jsdom;

const apiKey = process.env.API_KEY;

app.use(bodyParser.urlencoded({ extended: true }));

const document = getDocument("./public/index.html");

const searchBox = document.querySelector(".search-box");
const container = document.querySelector(".container");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

app.get("/", (req, res) => {
  res.getDocument(__dirname + "/public/index.html");
});

app.post("/", async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).json({ error: "City not found" });
    }

    const json = await response.json();
    console.log(json.name);

    if (json.cod === "404") {
      container.style.height = "400px";
      weatherBox.style.display = "none";
      weatherDetails.style.display = "none";
      error404.style.display = "block";
      error404.classList.add("fadeIn");
      return;
    }

    error404.style.display = "none";
    error404.classList.remove("fadeIn");

    const image = document.querySelector(".weather-box img");
    const cityName = document.querySelector(".weather-box .cityName");
    const temperature = document.querySelector(".weather-box .temperature");
    const description = document.querySelector(".weather-box .description");
    const Hicon = document.querySelector(".weather-details .humidity i");
    const Wicon = document.querySelector(".weather-details .wind i");
    const Sicon = document.querySelector(".weather-details .sunrise i");
    const humidity = document.querySelector(".weather-details .humidity span");
    const wind = document.querySelector(".weather-details .wind span");
    const sunrise = document.querySelector(".weather-details .sunrise span");

    const Wind = document.querySelector(".weather-details .wind");
    const Humidity = document.querySelector(".weather-details .humidity");
    const Sunrise = document.querySelector(".weather-details .sunrise");

    switch (json.weather[0].main) {
      case "Clear":
        image.src = "/images/clear.png";
        break;
      case "Rain":
        image.src = "/images/rain.png";
        break;
      case "Snow":
        image.src = "/images/snow.png";
        break;
      case "Clouds":
        image.src = "/images/cloud.png";
        break;
      case "Haze":
        image.src = "/images/mist.png";
        break;
      default:
        image.src = "";
    }

    cityName.innerHTML = `${json.name}, ${json.sys.country}`;
    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
    sunrise.innerHTML = `${getTime(json.sys.sunrise)}`;

    searchBox.style.marginLeft = "0.65rem";

    cityName.style.fontSize = "1.3rem";
    cityName.style.marginTop = "1rem";

    temperature.style.fontSize = "1.4rem";

    Hicon.style.fontSize = "1.2rem";
    Wicon.style.fontSize = "1.2rem";
    Sicon.style.fontSize = "1.2rem";

    weatherBox.style.display = "grid";
    weatherBox.classList.add("fadeIn");

    weatherDetails.style.display = "flex";
    weatherDetails.style.marginTop = "1.5rem";
    weatherDetails.style.alignContent = "space-evenly";
    weatherDetails.classList.add("fadeIn");

    Humidity.style.justifyContent = "flex-start";
    Humidity.style.marginLeft = "-1rem";
    humidity.style.fontSize = "1rem";
    Wind.style.justifyContent = "center";
    Wind.style.marginLeft = "2rem";
    wind.style.fontSize = "1rem";
    Sunrise.style.justifyContent = "flex-end";
    Sunrise.style.marginRight = "4rem";
    sunrise.style.fontSize = "1rem";

    container.style.height = "31rem";
    container.style.width = "25rem";
    container.style.transition = "0.6s ease-out";

    image.style.marginTop = "1rem";
    image.style.width = "35%";
    image.style.justifySelf = "center";

    res.send(document.defaultView.document.documentElement.outerHTML);
  } catch (error) {
    console.error(error);
    const error404 = document.querySelector(".not-found");
    error404.classList.add("fadeIn");
    error404.style.display = "block";
    const weatherBox = document.querySelector(".weather-box");
    const weatherDetails = document.querySelector(".weather-details");
    weatherBox.style.display = "none";
    weatherDetails.style.display = "none";
    res.send(document.defaultView.document.documentElement.outerHTML);
  }
});

function getDocument(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const dom = new JSDOM(fileContent);
  return dom.window.document;
}

function getTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const options = { hour: "2-digit", minute: "2-digit" };
  return date.toLocaleTimeString([], options).toLocaleUpperCase();
}

app.listen(4000, () => console.log("Server is running on port 4000"));
