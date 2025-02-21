import OpenWeatherMap from 'openweathermap-ts';

const owm = new OpenWeatherMap({
  apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY,
  units: "metric"
});

export async function getWeather(city = 'London') {
  try {
    const weather = await owm.getCurrentWeatherByCityName({ cityName: city });

    // Log the entire response for debugging
    console.log('Weather API Response:', JSON.stringify(weather));

    // Add proper null checks for each property
    if (!weather) {
      throw new Error('No weather data received');
    }

    if (!weather.main?.temp) {
      throw new Error('No temperature data available');
    }

    if (!weather.weather || weather.weather.length === 0) {
      throw new Error('No weather condition data available');
    }

    return {
      temperature: Math.round(weather.main.temp),
      condition: weather.weather[0].main || 'Unknown',
      description: weather.weather[0].description || 'No description available',
      city: weather.name || city,
      humidity: weather.main.humidity || 0,
      windSpeed: weather.wind?.speed ? Math.round(weather.wind.speed) : 0
    };
  } catch (error) {
    console.error('Weather API Error:', error.message || error);
    // Return a fallback response instead of throwing
    return {
      temperature: 0,
      condition: 'Unknown',
      description: 'Weather data unavailable',
      city: city,
      humidity: 0,
      windSpeed: 0,
      error: error.message || 'Failed to get weather data'
    };
  }
}
