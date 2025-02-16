// Constants for APIs
const apiKeyWeather = '745c470da2ec7b078f8ca2d2d8e34724';
const apiUrlWeather = 'https://api.openweathermap.org/data/2.5/weather?';
const apiUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast?';
const apiUrlParks = 'https://developer.nps.gov/api/v1/parks?stateCode=UT&api_key=hSNQ8CNB2HSWdwmsqeWFWP3KXHYZv6asTVzv5mv8';

// Placeholder for park data
let parks = [];

// Fetching Park Info from NPS API
async function fetchParks() {
    const response = await fetch(apiUrlParks);
    const data = await response.json();
    parks = data.data;
    displayParkList(parks);
}

// Displaying the list of parks
function displayParkList(parks) {
    const parkList = document.getElementById('park-list');
    parkList.innerHTML = ''; // Clear the list first
    parks.forEach(park => {
        const parkItem = document.createElement('div');
        parkItem.classList.add('park');
        parkItem.innerHTML = `
            <h3>${park.fullName}</h3>
            <p>${park.description}</p>
            <button onclick="getWeather('${park.latLong}')">Get Weather</button>
            <button onclick="displayParkDetails('${park.id}')">More Info</button>
            <button onclick="addToFavorites('${park.id}')">Add to Favorites</button>
        `;
        parkList.appendChild(parkItem);
    });
}

// Fetching Weather Info from OpenWeather API
async function getWeather(latLong) {
    // Remove the "lat:" and "long:" labels, then split the values and trim any extra spaces
    const [lat, lon] = latLong.replace('lat:', '').replace('long:', '').split(',').map(value => value.trim());

    const weatherResponse = await fetch(`${apiUrlWeather}&lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=imperial`);
    const weatherData = await weatherResponse.json();

    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `
        <h3>Weather Info</h3>
        <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">
        <p>Temperature: ${weatherData.main.temp}°F</p>
        <p>Feels Like: ${weatherData.main.feels_like}°F</p>
        <p>Condition: ${weatherData.weather[0].description}</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind Speed: ${weatherData.wind.speed} mph</p>
        <p>Wind Direction: ${weatherData.wind.deg}°</p>
        <p>Pressure: ${weatherData.main.pressure} hPa</p>
        <p>Cloudiness: ${weatherData.clouds.all}%</p>
        <p>Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;

    // Call getForecast to display the 5-day forecast
    getForecast(lat, lon);
}


// Fetching 5-Day Forecast Info from OpenWeather API
async function getForecast(lat, lon) {
    const forecastResponse = await fetch(`${apiUrlForecast}lat=${lat}&lon=${lon}&appid=${apiKeyWeather}&units=imperial`);
    const forecastData = await forecastResponse.json();

    const forecastDisplay = document.getElementById('forecast-display');
    forecastDisplay.innerHTML = '<h3>5-Day Forecast</h3>';

    forecastData.list.slice(0, 5).forEach((forecast, index) => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>Day ${index + 1}: ${forecast.main.temp}°F</p>
            <p>${forecast.weather[0].description}</p>
        `;
        forecastDisplay.appendChild(forecastItem);
    });
}

// Displaying Park Details
function displayParkDetails(parkId) {
    const park = parks.find(p => p.id === parkId);
    const detailsSection = document.getElementById('park-details');
    detailsSection.classList.toggle('open'); // Toggle the slide effect
    detailsSection.innerHTML = `
        <h3>${park.fullName}</h3>
        <p>${park.description}</p>
        <iframe
            width="600"
            height="400"
            frameborder="0"
            style="border:0"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3169.3871677261372!2d${park.longitude}!3d${park.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    `;
}

// Search Functionality for Parks
function searchParks(query) {
    const filteredParks = parks.filter(park => 
        park.fullName.toLowerCase().includes(query.toLowerCase())
    );
    displayParkList(filteredParks);
}

// Save Favorite Parks
let favoriteParks = JSON.parse(localStorage.getItem('favoriteParks')) || [];

function addToFavorites(parkId) {
    if (!favoriteParks.includes(parkId)) {
        favoriteParks.push(parkId);
        localStorage.setItem('favoriteParks', JSON.stringify(favoriteParks));
        displayFavorites();
    }
}

// Displaying Favorite Parks
function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';  // Clear previous list

    favoriteParks.forEach(parkId => {
        const park = parks.find(p => p.id === parkId); // Find the park by id
        if (park) {
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            favoriteItem.innerHTML = `
                <h3>${park.fullName}</h3>
                <p>${park.description}</p>
                <button onclick="removeFromFavorites('${park.id}')">Remove from Favorites</button>
            `;
            favoritesList.appendChild(favoriteItem);
        }
    });
}

// Remove Park from Favorites
function removeFromFavorites(parkId) {
    favoriteParks = favoriteParks.filter(id => id !== parkId);
    localStorage.setItem('favoriteParks', JSON.stringify(favoriteParks));
    displayFavorites();  // Re-render favorites list
}


// Initialize the page
window.onload = () => {
    fetchParks();
    displayFavorites();

    // Add search functionality
    const searchInput = document.getElementById('search-bar');
    searchInput.addEventListener('input', () => {
        searchParks(searchInput.value);
    });
};