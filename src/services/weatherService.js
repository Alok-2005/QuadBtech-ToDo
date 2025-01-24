import axios from 'axios';

const API_KEY = 'b58786f042ba33ba886b86c5113c6fbb';
const BASE_URL = 'http://api.openweathermap.org/data/2.5';

export const getWeatherForLocation = async (location) => {
  try {
    // First, get coordinates for the location
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
    );

    if (!geoResponse.data[0]) {
      throw new Error('Location not found');
    }

    const { lat, lon } = geoResponse.data[0];

    // Get the weather data using the coordinates
    const weatherResponse = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const { temp } = weatherResponse.data.main;
    const condition = weatherResponse.data.weather[0].main;

    // Determine if it's a good time for outdoor activities
    const isGoodTime = temp >= 15 && temp <= 30 && 
      !['Rain', 'Thunderstorm', 'Snow'].includes(condition);

    return {
      temperature: temp,
      condition,
      isGoodTime
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error('Failed to fetch weather data');
  }
};
