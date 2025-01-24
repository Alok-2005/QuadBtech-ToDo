import axios from 'axios';

const API_KEY = 'b58786f042ba33ba886b86c5113c6fbb'; // Replace with your valid OpenWeather API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherForLocation = async (location) => {
  try {
    // Validate location input
    if (!location) {
      throw new Error('Location cannot be empty');
    }

    // Step 1: Get coordinates for the location
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: location,
          limit: 1,
          appid: API_KEY,
        },
        timeout: 5000, // Set a timeout for network requests
      }
    );

    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error('Location not found');
    }

    const { lat, lon } = geoResponse.data[0];

    // Step 2: Get weather data using the coordinates
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric', // Use metric units for temperature in Celsius
      },
      timeout: 5000, // Set a timeout for network requests
    });

    if (!weatherResponse.data) {
      throw new Error('Failed to retrieve weather data');
    }

    const { temp } = weatherResponse.data.main;
    const condition = weatherResponse.data.weather[0].main;

    // Step 3: Determine if it's a good time for outdoor activities
    const isGoodTime =
      temp >= 15 && temp <= 30 && !['Rain', 'Thunderstorm', 'Snow'].includes(condition);

    // Return structured data
    return {
      temperature: temp,
      condition,
      isGoodTime,
    };
  } catch (error) {
    // Handle errors gracefully
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Weather fetch error:', error.message);
    }
    throw new Error('Failed to fetch weather data');
  }
};
