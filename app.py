from flask import Flask, render_template, request, jsonify
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Chaves de API
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'seu_api_key_aqui')
GEOCODING_API_KEY = os.getenv('GEOCODING_API_KEY', 'seu_api_key_aqui')

# URLs das APIs
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct"
REVERSE_GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/reverse"

class WeatherService:
    """Serviço para buscar dados de clima"""
    
    @staticmethod
    def get_weather_by_city(city):
        """Busca clima atual por nome da cidade"""
        try:
            params = {
                'q': city,
                'appid': OPENWEATHE_API_KEY,
                'units': 'metric',
                'lang': 'pt_br'
            }
            response = requests.get(WEATHER_URL, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_weather_by_coordinates(lat, lon):
        """Busca clima atual por coordenadas"""
        try:
            params = {
                'lat': lat,
                'lon': lon,
                'appid': OPENWEATHE_API_KEY,
                'units': 'metric',
                'lang': 'pt_br'
            }
            response = requests.get(WEATHER_URL, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_forecast(city):
        """Busca previsão para 5 dias"""
        try:
            params = {
                'q': city,
                'appid': OPENWEATHE_API_KEY,
                'units': 'metric',
                'lang': 'pt_br'
            }
            response = requests.get(FORECAST_URL, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}
    
    @staticmethod
    def get_city_coordinates(city):
        """Busca coordenadas de uma cidade"""
        try:
            params = {
                'q': city,
                'limit': 1,
                'appid': OPENWEATHE_API_KEY
            }
            response = requests.get(GEOCODING_URL, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            if data:
                return {
                    'lat': data[0]['lat'],
                    'lon': data[0]['lon'],
                    'city': data[0].get('name'),
                    'country': data[0].get('country')
                }
            return None
        except requests.exceptions.RequestException as e:
            return None
    
    @staticmethod
    def format_weather_data(data):
        """Formata dados de clima para exibição"""
        if 'error' in data:
            return None
        
        return {
            'city': data.get('name', 'Desconhecido'),
            'country': data.get('sys', {}).get('country', ''),
            'temperature': round(data.get('main', {}).get('temp', 0)),
            'feels_like': round(data.get('main', {}).get('feels_like', 0)),
            'humidity': data.get('main', {}).get('humidity', 0),
            'pressure': data.get('main', {}).get('pressure', 0),
            'description': data.get('weather', [{}])[0].get('description', ''),
            'icon': data.get('weather', [{}])[0].get('icon', ''),
            'wind_speed': round(data.get('wind', {}).get('speed', 0), 1),
            'wind_deg': data.get('wind', {}).get('deg', 0),
            'clouds': data.get('clouds', {}).get('all', 0),
            'visibility': data.get('visibility', 0),
            'sunrise': data.get('sys', {}).get('sunrise', 0),
            'sunset': data.get('sys', {}).get('sunset', 0),
            'timezone': data.get('timezone', 0)
        }

weather_service = WeatherService()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """API para buscar clima"""
    city = request.args.get('city')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not city and (not lat or not lon):
        return jsonify({'error': 'City ou coordenadas são necessárias'}), 400
    
    if city:
        data = weather_service.get_weather_by_city(city)
    else:
        data = weather_service.get_weather_by_coordinates(lat, lon)
    
    formatted = weather_service.format_weather_data(data)
    
    if formatted:
        return jsonify(formatted)
    else:
        return jsonify({'error': 'Cidade não encontrada'}), 404

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    """API para buscar previsão"""
    city = request.args.get('city')
    
    if not city:
        return jsonify({'error': 'City é necessária'}), 400
    
    data = weather_service.get_forecast(city)
    
    if 'list' in data:
        forecasts = []
        for item in data['list'][::8]:  # A cada 24 horas
            forecasts.append({
                'date': datetime.fromtimestamp(item['dt']).strftime('%d/%m/%Y'),
                'temp_max': round(item['main']['temp_max']),
                'temp_min': round(item['main']['temp_min']),
                'description': item['weather'][0]['description'],
                'icon': item['weather'][0]['icon'],
                'humidity': item['main']['humidity'],
                'wind_speed': round(item['wind']['speed'], 1)
            })
        return jsonify({'forecasts': forecasts})
    else:
        return jsonify({'error': 'Previsão não encontrada'}), 404

@app.route('/api/cities', methods=['GET'])
def search_cities():
    """API para buscar cidades por coordenadas"""
    query = request.args.get('q')
    
    if not query:
        return jsonify({'error': 'Query é necessária'}), 400
    
    try:
        params = {
            'q': query,
            'limit': 5,
            'appid': OPENWEATHE_API_KEY
        }
        response = requests.get(GEOCODING_URL, params=params, timeout=10)
        response.raise_for_status()
        cities = response.json()
        
        results = []
        for city in cities:
            results.append({
                'name': city.get('name'),
                'country': city.get('country'),
                'lat': city.get('lat'),
                'lon': city.get('lon')
            })
        
        return jsonify({'cities': results})
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
