// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const citySuggestions = document.getElementById('citySuggestions');
const mainContent = document.getElementById('mainContent');
const welcomeSection = document.getElementById('welcomeSection');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Configuration
const API_BASE_URL = '/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    // Try to load weather for default city
    loadWeatherForCity('São Paulo');
});

function setupEventListeners() {
    searchBtn.addEventListener('click', () => searchWeather());
    locationBtn.addEventListener('click', () => getLocationWeather());
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    cityInput.addEventListener('input', (e) => {
        if (e.target.value.length > 2) {
            searchCities(e.target.value);
        } else {
            citySuggestions.innerHTML = '';
        }
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'flex';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showLoading() {
    loadingSpinner.style.display = 'block';
    mainContent.style.display = 'none';
    welcomeSection.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showMainContent() {
    mainContent.style.display = 'block';
    welcomeSection.style.display = 'none';
}

function showWelcome() {
    welcomeSection.style.display = 'block';
    mainContent.style.display = 'none';
}

function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        citySuggestions.innerHTML = '';
        loadWeatherForCity(city);
    }
}

function searchCities(query) {
    fetch(`${API_BASE_URL}/cities?q=${query}`)
        .then(response => response.json())
        .then(data => {
            citySuggestions.innerHTML = '';
            if (data.cities) {
                data.cities.forEach(city => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.innerHTML = `
                        <span class="suggestion-city">${city.name}</span>
                        <span class="suggestion-country">${city.country || ''}</span>
                    `;
                    div.addEventListener('click', () => {
                        cityInput.value = city.name;
                        citySuggestions.innerHTML = '';
                        loadWeatherForCity(city.name);
                    });
                    citySuggestions.appendChild(div);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
        });
}

function loadWeatherForCity(city) {
    showLoading();
    
    fetch(`${API_BASE_URL}/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError('Cidade não encontrada. Tente novamente.');
                showWelcome();
                hideLoading();
            } else {
                cityInput.value = data.city;
                displayWeather(data);
                loadForecast(data.city);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Erro ao buscar dados de clima.');
            showWelcome();
            hideLoading();
        });
}

function getLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocalização não é suportada pelo seu navegador.');
        return;
    }

    showLoading();
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetch(`${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        showError('Não foi possível obter o clima para sua localização.');
                        showWelcome();
                    } else {
                        cityInput.value = data.city;
                        displayWeather(data);
                        loadForecast(data.city);
                    }
                    hideLoading();
                })
                .catch(error => {
                    console.error('Error:', error);
                    showError('Erro ao buscar dados de clima.');
                    showWelcome();
                    hideLoading();
                });
        },
        (error) => {
            showError('Não foi possível acessar sua localização.');
            showWelcome();
            hideLoading();
        }
    );
}

function displayWeather(data) {
    // Update weather information
    document.getElementById('cityName').textContent = `${data.city}, ${data.country}`;
    document.getElementById('currentTemp').textContent = `${data.temperature}°C`;
    document.getElementById('feelsLike').textContent = `${data.feels_like}°C`;
    document.getElementById('weatherDesc').textContent = data.description;
    
    // Update icon
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
    
    // Update details
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind_speed} m/s`;
    document.getElementById('pressure').textContent = `${data.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('clouds').textContent = `${data.clouds}%`;
    
    // Wind direction
    const windDir = getWindDirection(data.wind_deg);
    document.getElementById('windDir').textContent = windDir;
    
    // Sun times
    const sunrise = new Date(data.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sunset * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunrise').textContent = sunrise;
    document.getElementById('sunset').textContent = sunset;
    
    // Update time
    const now = new Date().toLocaleString('pt-BR');
    document.getElementById('updateTime').textContent = `Atualizado em: ${now}`;
    
    showMainContent();
    hideLoading();
}

function loadForecast(city) {
    fetch(`${API_BASE_URL}/forecast?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.forecasts) {
                displayForecast(data.forecasts);
            }
        })
        .catch(error => {
            console.error('Error loading forecast:', error);
        });
}

function displayForecast(forecasts) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';
    
    forecasts.forEach(forecast => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.icon}@2x.png`;
        
        card.innerHTML = `
            <div class="forecast-date">${forecast.date}</div>
            <img src="${iconUrl}" alt="" class="forecast-icon">
            <div class="forecast-description">${forecast.description}</div>
            <div class="forecast-temps">
                <div class="forecast-temp-max">↑ ${forecast.temp_max}°C</div>
                <div class="forecast-temp-min">↓ ${forecast.temp_min}°C</div>
            </div>
            <div class="forecast-details">
                <div class="forecast-detail-item">
                    <i class="fas fa-droplet"></i> ${forecast.humidity}%
                </div>
                <div class="forecast-detail-item">
                    <i class="fas fa-wind"></i> ${forecast.wind_speed} m/s
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((degrees % 360) / 22.5);
    return directions[index % 16];
}
