// backend/routes/chatbot.js
const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude API
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

// Store conversation history (in production, use database)
const conversationHistory = new Map();

// Chat endpoint
router.post('/query', async (req, res) => {
  try {
    const { message, user_id, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get or create conversation history
    const userId = user_id || 'default';
    let history = conversationHistory.get(userId) || [];

    // Build system prompt for agriculture assistant
    const systemPrompt = `You are an expert agriculture assistant helping farmers with:
- Crop selection and recommendations
- Disease identification and treatment
- Fertilizer and irrigation advice
- Soil management
- Pest control
- Weather-related farming advice
- Organic farming practices

Provide practical, actionable advice in simple language. Be concise but thorough.

${context ? `Current context: ${JSON.stringify(context)}` : ''}`;

    // Add user message to history
    history.push({
      role: 'user',
      content: message
    });

    // Keep only last 10 messages to manage token usage
    if (history.length > 10) {
      history = history.slice(-10);
    }

    // Call Claude API
    let assistantMessage;
    if (anthropic.apiKey) {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: history
      });
      assistantMessage = response.content[0].text;
    } else {
      // Mock response for testing
      assistantMessage = "Hello! I'm your agriculture assistant. I can help you with crop recommendations, disease identification, fertilizer advice, and farming tips. How can I assist you today?";
    }

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: assistantMessage
    });

    // Update conversation history
    conversationHistory.set(userId, history);

    res.json({
      success: true,
      response: assistantMessage,
      conversation_id: userId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    
    // Fallback response if API fails
    const fallbackResponse = getFallbackResponse(req.body.message);
    
    res.status(error.status || 500).json({
      success: false,
      message: 'Chatbot temporarily unavailable',
      fallback_response: fallbackResponse,
      error: error.message
    });
  }
});

// Clear conversation history
router.delete('/history/:userId', (req, res) => {
  const { userId } = req.params;
  conversationHistory.delete(userId);
  
  res.json({
    success: true,
    message: 'Conversation history cleared'
  });
});

// Get conversation history
router.get('/history/:userId', (req, res) => {
  const { userId } = req.params;
  const history = conversationHistory.get(userId) || [];
  
  res.json({
    success: true,
    history: history
  });
});

// Fallback responses for common questions (if API fails)
function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('water') || msg.includes('irrigat')) {
    return 'For most crops, water early morning or late evening. Avoid waterlogging. Use drip irrigation for best results. Check soil moisture before watering.';
  }
  
  if (msg.includes('fertil')) {
    return 'Use balanced NPK fertilizer based on soil test. Apply organic compost regularly. Avoid over-fertilization. Split application is better than single dose.';
  }
  
  if (msg.includes('pest') || msg.includes('insect')) {
    return 'Use neem oil spray as natural pesticide. Practice crop rotation. Remove infected plants. Use yellow sticky traps. Chemical pesticides as last resort.';
  }
  
  if (msg.includes('disease')) {
    return 'Identify the disease first. Remove infected parts immediately. Improve air circulation. Avoid overhead watering. Use appropriate fungicide if needed.';
  }
  
  if (msg.includes('soil')) {
    return 'Get soil tested regularly. Add organic matter like compost. Maintain pH 6-7 for most crops. Practice crop rotation. Use green manure crops.';
  }
  
  if (msg.includes('organic')) {
    return 'Use compost, vermicompost, and bio-fertilizers. Neem products for pest control. Crop rotation and mixed cropping. Avoid chemical pesticides and fertilizers.';
  }
  
  return 'I can help you with crop recommendations, disease treatment, fertilizer advice, irrigation tips, and general farming questions. Please try asking your question in a different way.';
}

module.exports = router;