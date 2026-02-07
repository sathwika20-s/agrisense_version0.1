// backend/routes/disease.js
const express = require('express');
const router = express.Router();
const diseasesDatabase = require('../data/diseases_database.json');

// Detect disease based on crop name
router.post('/detect', async (req, res) => {
  try {
    const { crop_name } = req.body;

    console.log('Crop:', crop_name);

    // Use rule-based disease detection
    const detectionResult = detectDiseaseRuleBased(crop_name);

    // Get disease details from database
    const diseaseInfo = diseasesDatabase.diseases.find(
      d => d.name.toLowerCase() === detectionResult.disease_name.toLowerCase() &&
           d.crop.toLowerCase() === (crop_name || '').toLowerCase()
    );

    const response = {
      success: true,
      detection: {
        disease_name: detectionResult.disease_name,
        confidence: detectionResult.confidence,
        crop: crop_name || 'Unknown',
        detected_at: new Date().toISOString()
      },
      disease_info: diseaseInfo || getDefaultDiseaseInfo(detectionResult.disease_name),
      recommendations: {
        immediate_action: diseaseInfo?.immediate_action || 'Remove infected parts',
        treatment: diseaseInfo?.treatment || {},
        prevention: diseaseInfo?.prevention || [],
        fertilizer_advice: getFertilizerAdvice(crop_name, detectionResult.disease_name),
        irrigation_advice: getIrrigationAdvice(crop_name)
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Disease detection error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to detect disease',
      error: error.message
    });
  }
});



// Rule-based disease detection (fallback/demo)
function detectDiseaseRuleBased(cropName) {
  // Demo: Return random disease for demonstration
  const commonDiseases = {
    'tomato': ['Early Blight', 'Late Blight', 'Leaf Spot'],
    'potato': ['Late Blight', 'Early Blight', 'Bacterial Wilt'],
    'rice': ['Brown Spot', 'Blast', 'Bacterial Leaf Blight'],
    'wheat': ['Rust', 'Powdery Mildew', 'Leaf Blight'],
    'corn': ['Gray Leaf Spot', 'Northern Leaf Blight', 'Common Rust']
  };

  const crop = (cropName || 'tomato').toLowerCase();
  const diseases = commonDiseases[crop] || commonDiseases['tomato'];
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];

  return {
    disease_name: randomDisease,
    confidence: (75 + Math.random() * 20).toFixed(2) // Random confidence 75-95%
  };
}

// Get default disease info if not in database
function getDefaultDiseaseInfo(diseaseName) {
  return {
    name: diseaseName,
    description: `${diseaseName} is a common plant disease that affects crop health and yield.`,
    symptoms: [
      'Discoloration of leaves',
      'Wilting or drooping',
      'Spots or lesions on plant parts'
    ],
    immediate_action: 'Remove and destroy infected plant parts to prevent spread',
    treatment: {
      organic: ['Neem oil spray', 'Garlic extract', 'Baking soda solution'],
      chemical: ['Copper-based fungicide', 'Systemic fungicide as per label']
    },
    prevention: [
      'Use disease-resistant varieties',
      'Maintain proper spacing for air circulation',
      'Avoid overhead watering',
      'Practice crop rotation'
    ]
  };
}

// Get fertilizer advice based on crop and disease
function getFertilizerAdvice(cropName, diseaseName) {
  return {
    recommendation: 'Balanced NPK fertilizer',
    dosage: '10-10-10 NPK @ 2kg per 100 sq.m',
    timing: 'Apply after disease treatment',
    additional: [
      'Add compost for soil health',
      'Use micronutrient spray if deficiency observed',
      'Avoid over-fertilization which can worsen disease'
    ],
    notes: 'Healthy plants resist diseases better. Maintain soil fertility.'
  };
}

// Get irrigation advice
function getIrrigationAdvice(cropName) {
  return {
    frequency: 'Once every 3-4 days depending on soil moisture',
    method: 'Drip irrigation recommended to avoid leaf wetness',
    amount: '20-25mm per irrigation',
    timing: 'Early morning preferred',
    notes: [
      'Avoid waterlogging which promotes disease',
      'Reduce watering during rainy season',
      'Ensure proper drainage'
    ]
  };
}

// Get disease details by ID
router.get('/:diseaseId', (req, res) => {
  try {
    const disease = diseasesDatabase.diseases.find(
      d => d.id === parseInt(req.params.diseaseId)
    );

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }

    res.json({
      success: true,
      disease: disease
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease details',
      error: error.message
    });
  }
});

// Get all diseases
router.get('/', (req, res) => {
  res.json({
    success: true,
    total_diseases: diseasesDatabase.diseases.length,
    diseases: diseasesDatabase.diseases
  });
});

module.exports = router;