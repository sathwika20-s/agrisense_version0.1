// backend/routes/crops.js
const express = require('express');
const router = express.Router();
const cropsDatabase = require('../data/crops_database.json');

// Get crop recommendations based on climate
router.post('/recommend', async (req, res) => {
  try {
    const { 
      temperature, 
      humidity, 
      rainfall, 
      season, 
      soil_type,
      area 
    } = req.body;

    if (!temperature || !humidity) {
      return res.status(400).json({
        success: false,
        message: 'Temperature and humidity are required'
      });
    }

    // Filter crops based on climate conditions
    const suitableCrops = cropsDatabase.crops.filter(crop => {
      const tempMatch = temperature >= crop.climate_requirements.temperature.min && 
                        temperature <= crop.climate_requirements.temperature.max;
      
      const humidityMatch = humidity >= crop.climate_requirements.humidity.min && 
                            humidity <= crop.climate_requirements.humidity.max;
      
      // Rainfall match (if provided)
      let rainfallMatch = true;
      if (rainfall) {
        rainfallMatch = rainfall >= crop.climate_requirements.rainfall.min && 
                        rainfall <= crop.climate_requirements.rainfall.max;
      }

      // Season match (if provided)
      let seasonMatch = true;
      if (season) {
        seasonMatch = crop.season.toLowerCase().includes(season.toLowerCase());
      }

      // Soil match (if provided)
      let soilMatch = true;
      if (soil_type) {
        soilMatch = crop.soil.some(s => s.toLowerCase() === soil_type.toLowerCase());
      }

      return tempMatch && humidityMatch && rainfallMatch && seasonMatch && soilMatch;
    });

    // Sort by suitability score
    const rankedCrops = suitableCrops.map(crop => {
      const score = calculateSuitabilityScore(crop, temperature, humidity, rainfall);
      return { ...crop, suitability_score: score };
    }).sort((a, b) => b.suitability_score - a.suitability_score);

    // Get top 5 recommendations
    const topCrops = rankedCrops.slice(0, 5);

    res.json({
      success: true,
      location: area,
      conditions: {
        temperature: `${temperature}°C`,
        humidity: `${humidity}%`,
        rainfall: rainfall ? `${rainfall} mm` : 'N/A',
        season: season || 'All seasons'
      },
      total_suitable_crops: suitableCrops.length,
      recommendations: topCrops,
      message: topCrops.length > 0 
        ? 'Crop recommendations generated successfully' 
        : 'No suitable crops found for current conditions'
    });

  } catch (error) {
    console.error('Crop recommendation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error.message
    });
  }
});

// Get details of a specific crop
router.get('/:cropName', (req, res) => {
  try {
    const { cropName } = req.params;
    const crop = cropsDatabase.crops.find(
      c => c.name.toLowerCase() === cropName.toLowerCase()
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: `Crop '${cropName}' not found in database`
      });
    }

    res.json({
      success: true,
      crop: crop
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop details',
      error: error.message
    });
  }
});

// Get all crops
router.get('/', (req, res) => {
  res.json({
    success: true,
    total_crops: cropsDatabase.crops.length,
    crops: cropsDatabase.crops
  });
});

// Calculate suitability score (0-100)
function calculateSuitabilityScore(crop, temperature, humidity, rainfall) {
  let score = 0;

  // Temperature score (40 points)
  const optimalTemp = crop.climate_requirements.temperature.optimal;
  const tempDiff = Math.abs(temperature - optimalTemp);
  score += Math.max(0, 40 - (tempDiff * 2));

  // Humidity score (30 points)
  const avgHumidity = (crop.climate_requirements.humidity.min + 
                       crop.climate_requirements.humidity.max) / 2;
  const humidityDiff = Math.abs(humidity - avgHumidity);
  score += Math.max(0, 30 - humidityDiff / 2);

  // Rainfall score (30 points) - if provided
  if (rainfall) {
    const avgRainfall = (crop.climate_requirements.rainfall.min + 
                         crop.climate_requirements.rainfall.max) / 2;
    const rainfallDiff = Math.abs(rainfall - avgRainfall);
    score += Math.max(0, 30 - rainfallDiff / 100);
  } else {
    score += 15; // Default score if rainfall not provided
  }

  return Math.round(score);
}

module.exports = router;