// Globals
var citySearchHistory = [];
//  OpenWeather API variables
var weatherURl = 'https://api.openweathermap.org';
var APIKey = 'a0aa59ab54c8737ca6fbb9392215f40f';

// DOM elements
var cityForm = document.querySelector('#city-form');
var citySearch = document.querySelector('#city-search');
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
    for (var i = citySearchHistory.length - 1; i > 0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-controls', 'current-weather future-weather');
        btn.classList.add('search-history-btn');
        btn.setAttribute('citySearchHistory');
        btn.textContent = citySearchHistory[1];
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
function showCurrentWeather(city, weather, time) {
    var currentDate = dayjs().tz(time).format('M/D/YYYY');

    // Store response data from our fetch request in variables
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
    WeatherCard.append(weatherCardBody);

    heading.setAttribute('class', 'h3 card-title');
    temperatureEl.setAttribute('class', 'card-text');
    windSpeedEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    heading.textContent = `${city} (${currentDate})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    temperatureEl.textContent = `Temp: ${temperature}°F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    weatherCardBody.append(heading, tempEl, windEl, humidityEl);

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
    uviEl.append(uviBadge);
    WeatherCardBody.append(uvEl);

    currentWeatherEl.innerHTML = '';
    currentWeatherEl.append(weatherCard);
}



