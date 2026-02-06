// backend/routes/climate.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Climate prediction from coordinates
router.post('/predict', async (req, res) => {
  try {
    const { latitude, longitude, area } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Call OpenWeatherMap API
    const apiKey = process.env.OPENWEATHER_API_KEY;

    let weatherData;
    if (apiKey) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const weatherResponse = await axios.get(weatherUrl);
      weatherData = weatherResponse.data;
    } else {
      // Mock weather data for testing
      weatherData = {
        name: 'Test Location',
        sys: { country: 'IN' },
        main: {
          temp: 25,
          feels_like: 28,
          humidity: 70,
          pressure: 1013
        },
        weather: [{ description: 'clear sky', main: 'Clear' }],
        wind: { speed: 2.5 }
      };
    }

    // Determine climate zone based on temperature and conditions
    const climate = determineClimateZone(
      weatherData.main.temp,
      weatherData.main.humidity,
      weatherData.weather[0].main
    );

    // Get seasonal data (optional: you can also call forecast API)
    const season = getCurrentSeason();

    const climateInfo = {
      success: true,
      location: {
        area: area || `${weatherData.name}, ${weatherData.sys.country}`,
        coordinates: { latitude, longitude }
      },
      current_weather: {
        temperature: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        description: weatherData.weather[0].description,
        wind_speed: weatherData.wind.speed
      },
      climate_zone: climate,
      season: season,
      suitable_for_farming: climate.suitable_for_farming,
      timestamp: new Date().toISOString()
    };

    res.json(climateInfo);

  } catch (error) {
    console.error('Climate prediction error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to predict climate',
      error: error.message
    });
  }
});

// Get climate zones information
router.get('/zones', (req, res) => {
  const climateZones = require('../data/climatezone_datbase.json');
  res.json({
    success: true,
    zones: climateZones
  });
});

// Helper function to determine climate zone
function determineClimateZone(temperature, humidity, condition) {
  let zone = {
    name: '',
    type: '',
    characteristics: [],
    suitable_for_farming: false
  };

  // Tropical climate
  if (temperature >= 25 && humidity >= 60) {
    zone.name = 'Tropical';
    zone.type = humidity >= 80 ? 'Tropical Wet' : 'Tropical Dry';
    zone.characteristics = [
      'High temperature year-round',
      'Abundant rainfall',
      'High humidity',
      'Suitable for rice, sugarcane, tropical fruits'
    ];
    zone.suitable_for_farming = true;
  }
  // Arid/Semi-arid climate
  else if (temperature >= 20 && humidity < 40) {
    zone.name = 'Arid';
    zone.type = 'Desert/Semi-arid';
    zone.characteristics = [
      'Low rainfall',
      'High temperature variation',
      'Low humidity',
      'Suitable for drought-resistant crops: bajra, jowar'
    ];
    zone.suitable_for_farming = true; // With irrigation
  }
  // Temperate climate
  else if (temperature >= 10 && temperature < 25) {
    zone.name = 'Temperate';
    zone.type = 'Moderate climate';
    zone.characteristics = [
      'Moderate temperature',
      'Four distinct seasons',
      'Suitable for wheat, barley, vegetables'
    ];
    zone.suitable_for_farming = true;
  }
  // Cold climate
  else if (temperature < 10) {
    zone.name = 'Cold';
    zone.type = 'Alpine/Mountain';
    zone.characteristics = [
      'Low temperature',
      'Short growing season',
      'Limited crop variety'
    ];
    zone.suitable_for_farming = false;
  }

  return zone;
}

// Helper function to get current season (India-specific)
function getCurrentSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 3 && month <= 6) {
    return {
      name: 'Summer',
      farming_season: 'Zaid (March-June)',
      crops: ['Watermelon', 'Cucumber', 'Muskmelon', 'Pumpkin']
    };
  } else if (month >= 7 && month <= 10) {
    return {
      name: 'Monsoon',
      farming_season: 'Kharif (June-October)',
      crops: ['Rice', 'Maize', 'Cotton', 'Soybean', 'Groundnut']
    };
  } else {
    return {
      name: 'Winter',
      farming_season: 'Rabi (October-March)',
      crops: ['Wheat', 'Barley', 'Mustard', 'Chickpea', 'Potato']
    };
  }
}

module.exports = router;