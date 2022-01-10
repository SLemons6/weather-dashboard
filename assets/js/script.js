// Globals
var citySearchHistory = [];
//  OpenWeather API variables
var weatherUrl = 'https://api.openweathermap.org';
var apiKey = 'a0aa59ab54c8737ca6fbb9392215f40f';

// DOM elements
var cityForm = document.querySelector('#city-form');
var citySearchInput = document.querySelector('#city-input');
var searchHistoryEl = document.querySelector('#search-history');
var currentWeatherEl = document.querySelector('#current-weather');
var futureWeatherEl = document.querySelector('#future-weather');

// Dayjs timezone plugins 
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Display search history
function showSearchHistory() {
    searchHistoryEl.innerHTML = '';

    // display search history from most recent to least recent 
    for (var i = citySearchHistory.length - 1; i >= 0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('current', 'aria-controls');
        btn.classList.add('btn', 'search-history-btn', 'text-center', 'text-dark', 'my-2', 'border', 'rounded-1', 'fw-bold');
        btn.style.backgroundColor = "#b3b3b3"
        btn.setAttribute('city-search', citySearchHistory[i]);
        btn.textContent = citySearchHistory[i];
        searchHistoryEl.append(btn);
    }
}

// Update local storage history and displayed search history.
function updateHistory(search) {
    // return function if there are no searches in storage
    if (citySearchHistory.indexOf(search) !== -1) {
        return;
    }
    citySearchHistory.push(search);

    localStorage.setItem('city-search-history', JSON.stringify(citySearchHistory));
    showSearchHistory();
}

// retrieve search history from local storage 
function fetchHistory() {
    var storedSearches = localStorage.getItem('city-search-history');
    if (storedSearches) {
        storedSearches = JSON.parse(storedSearches);
    }
    showSearchHistory();
}

// Display current weather
function showCurrent(city, weather, time) {
    var currentDate = dayjs().tz(time).format('M/D/YYYY');

    // Store data from Open Weather API fetch request
    var temperature = weather.temp;
    var windSpeed = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var weatherCard = document.createElement('div');
    var weatherCardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var temperatureEl = document.createElement('p');
    var windSpeedEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uviEl = document.createElement('p');
    var uviButton = document.createElement('button');

    weatherCard.setAttribute('class', 'card');
    weatherCardBody.setAttribute('class', 'card-body');

    weatherCard.append(weatherCardBody);

    heading.setAttribute('class', 'h3 card-title fw-bold');
    temperatureEl.setAttribute('class', 'card-text');
    windSpeedEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    heading.textContent = `${city} (${currentDate})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    temperatureEl.textContent = `Temp: ${temperature}°F`;
    windSpeedEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    weatherCardBody.append(heading, temperatureEl, windSpeedEl, humidityEl);

    uviEl.textContent = 'UV Index: ';
    uviButton.classList.add('btn', 'btn-sm');

    if (uvi < 2.5) {
        uviButton.classList.add('btn-success');
    } else if (uvi < 5) {
        uviButton.classList.add('btn-warning');
    } else {
        uviButton.classList.add('btn-danger');
    }

    uviButton.textContent = uvi;
    uviEl.append(uviButton);
    weatherCardBody.append(uviEl);

    currentWeatherEl.innerHTML = '';
    currentWeatherEl.append(weatherCard);
}


// Display a forecast card
function createForecastCard(forecast, time) {
    // variables for data from api
    var unixtext = forecast.dt;
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var temp = forecast.temp.day;
    var { humidity } = forecast;
    var windSpeed = forecast.wind_speed;
  
    // Create elements for a card
    var column = document.createElement('div');
    var forecastCard = document.createElement('div');
    var forecastCardBody = document.createElement('div');
    var forecastCardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var temperatureEl = document.createElement('p');
    var windSpeedEl = document.createElement('p');
    var humidityEl = document.createElement('p');
  
    column.append(forecastCard);
    forecastCard.append(forecastCardBody);
    forecastCardBody.append(forecastCardTitle, weatherIcon, temperatureEl, windSpeedEl, humidityEl);
  
    column.setAttribute('class', 'col-md');
    forecastCard.setAttribute('class', 'card h-100 text-white');
    forecastCard.style.backgroundColor = "#19334d"
    forecastCardBody.setAttribute('class', 'card-body p-2');
    forecastCardTitle.setAttribute('class', 'card-title');
    temperatureEl.setAttribute('class', 'card-text');
    windSpeedEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');
  
    // Update elements 
    forecastCardTitle.textContent = dayjs.unix(unixtext).tz(time).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    temperatureEl.textContent = `Temp: ${temp} °F`;
    windSpeedEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
  
    futureWeatherEl.append(column);
  }
  
  // Display 5 day forecast.
  function displayFiveDayForecast(forecast, time) {
    // Create timestamps 
    var firstDay = dayjs().tz(time).add(1, 'day').startOf('day').unix();
    var lastDay = dayjs().tz(time).add(6, 'day').startOf('day').unix();
  
    var forecastColumn = document.createElement('div');
    var forecastHeading = document.createElement('h4');
  
    forecastColumn.setAttribute('class', 'col-12');
    forecastHeading.textContent = '5-Day Forecast:';
    forecastHeading.setAttribute('class', 'fw-bold');
    forecastColumn.append(forecastHeading);
  
    futureWeatherEl.innerHTML = '';
    futureWeatherEl.append(forecastColumn);
    for (var i = 0; i < forecast.length; i++) {
      if (forecast[i].dt >= firstDay && forecast[i].dt < lastDay) {
        createForecastCard(forecast[i], time);
      }
    }
  }
  
  function renderItems(city, data) {
    showCurrent(city, data.current, data.time);
    displayFiveDayForecast(data.daily, data.time);
  }
  
  // Find weather based on latitude and longitude coordinates, and call functions to display forecast
  function findWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var oWUrl = `${weatherUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;
  
    fetch(oWUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        renderItems(city, data);
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  
  function findCoordinates(search) {
    var oWUrl = `${weatherUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
  
    fetch(oWUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          updateHistory(search);
          findWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }
  
  function searchSubmit(event) {
    // Don't continue if there is nothing in the search form
    if (!citySearchInput.value) {
      return;
    }
  
    event.preventDefault();
    var search = citySearchInput.value.trim();
    findCoordinates(search);
    citySearchInput.value = '';
  }
  
  function searchHistoryClick(event) {
    // Don't do search if current elements is not a search history button
    if (!event.target.matches('.search-history-btn')) {
      return;
    }
  
    var btn = event.target;
    var search = btn.getAttribute('city-search');
    findCoordinates(search);
  }
  
  fetchHistory();
  cityForm.addEventListener('submit', searchSubmit);
  searchHistoryEl.addEventListener('click', searchHistoryClick);
  


