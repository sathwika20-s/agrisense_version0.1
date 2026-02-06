# Smart Agriculture Studio - Full Stack Application

A modern, full-stack smart agriculture platform with AI-powered crop recommendations, disease detection, climate insights, and an intelligent chatbot assistant.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

### Installation & Setup

#### 1. Backend Setup

```bash
cd backend
npm install
```

**Configure Environment Variables:**
The `.env` file is already configured, but you can modify it if needed:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/agrisense
OPENWEATHER_API_KEY=your_openweather_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

**Start MongoDB:**
Make sure MongoDB is running on your system. If using local MongoDB:
```bash
# Windows (if MongoDB is installed as service, it should auto-start)
# Or start manually:
mongod
```

**Start Backend Server:**
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
📍 API URL: http://localhost:5000/api
```

#### 2. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy).

## 📁 Project Structure

```
Project/
├── backend/
│   ├── server.js              # Main Express server
│   ├── routes/                # API route handlers
│   │   ├── climate.js         # Climate prediction endpoints
│   │   ├── crops.js           # Crop recommendation endpoints
│   │   ├── disease.js         # Disease detection endpoints
│   │   └── chatbot.js         # AI chatbot endpoints
│   ├── data/                  # JSON databases
│   ├── model/                 # ML models (if any)
│   ├── uploads/               # Uploaded images
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── pages/             # React page components
    │   │   ├── Dashboard.jsx
    │   │   ├── ClimateInsights.jsx
    │   │   ├── CropAdvisor.jsx
    │   │   ├── DiseaseScanner.jsx
    │   │   └── SmartChat.jsx
    │   ├── services/
    │   │   └── api.js          # API client functions
    │   ├── App.jsx             # Main app component
    │   ├── main.jsx            # React entry point
    │   ├── App.css             # Component styles
    │   └── index.css           # Global styles
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Climate
- `POST /api/climate/predict` - Get climate prediction for coordinates
- `GET /api/climate/zones` - Get all climate zones

### Crops
- `POST /api/crops/recommend` - Get crop recommendations based on climate
- `GET /api/crops` - Get all crops
- `GET /api/crops/:cropName` - Get specific crop details

### Disease Detection
- `POST /api/disease/detect` - Detect disease from image (multipart/form-data)
- `GET /api/disease` - Get all diseases
- `GET /api/disease/:diseaseId` - Get specific disease details

### Chatbot
- `POST /api/chatbot/query` - Send message to AI chatbot
- `GET /api/chatbot/history/:userId` - Get conversation history
- `DELETE /api/chatbot/history/:userId` - Clear conversation history

## 🎯 Features

### 1. Dashboard
- Overview of all modules
- Backend health status
- Knowledge base statistics
- Quick access to all features

### 2. Climate Insights
- Enter latitude/longitude to get:
  - Current weather conditions
  - Climate zone classification
  - Season-specific crop suggestions
  - Farming suitability assessment

### 3. Crop Advisor
- Input climate conditions (temperature, humidity, rainfall, season, soil)
- Get ranked crop recommendations with:
  - Suitability scores (0-100)
  - Climate requirements
  - Soil preferences
  - Key cultivation points

### 4. Disease Scanner
- Upload crop leaf images
- Get instant disease detection with:
  - Disease identification
  - Confidence scores
  - Treatment recommendations (organic & chemical)
  - Prevention strategies
  - Fertilizer and irrigation advice

### 5. Smart Chatbot
- Real-time AI-powered conversations
- Ask questions about:
  - Crop management
  - Disease treatment
  - Fertilizer advice
  - Irrigation scheduling
  - Organic farming practices
- Conversation history maintained
- Connection status indicator

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **Multer** - File upload handling
- **Anthropic Claude API** - AI chatbot
- **OpenWeatherMap API** - Weather data
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool
- **Modern CSS** - Custom styling with CSS variables

## 🔧 Troubleshooting

### Backend won't start
1. Check if MongoDB is running: `mongosh` or check MongoDB service
2. Verify `.env` file exists in `backend/` folder
3. Check if port 5000 is available: `netstat -ano | findstr :5000`
4. Install dependencies: `cd backend && npm install`

### Frontend can't connect to backend
1. Ensure backend is running on `http://localhost:5000`
2. Check browser console for CORS errors
3. Verify `BASE_URL` in `Frontend/src/services/api.js` is `http://localhost:5000/api`
4. Check backend CORS configuration in `server.js`

### Chatbot not working
1. Verify `ANTHROPIC_API_KEY` is set in `backend/.env`
2. Check backend logs for API errors
3. If API key is missing, chatbot will use fallback responses
4. Check connection status indicator in chatbot UI

### Disease detection not working
1. Ensure `uploads/` folder exists in `backend/` directory
2. Check file size limit (max 5MB)
3. Verify image format (PNG, JPG, JPEG only)
4. Check backend logs for multer errors

## 📝 Development Notes

### Running Both Servers

**Option 1: Two Terminal Windows**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

**Option 2: Use npm-run-all (if installed)**
```bash
npm install -g npm-run-all
# Then create a script to run both
```

### Environment Variables

Backend requires:
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `OPENWEATHER_API_KEY` - Optional, for real weather data
- `ANTHROPIC_API_KEY` - Optional, for AI chatbot (uses fallback if missing)

## 🎨 UI Features

- **Modern glassmorphism design** with dark theme
- **Responsive layout** - works on desktop and mobile
- **Real-time updates** - live connection status
- **Smooth animations** - typing indicators, auto-scroll
- **Error handling** - user-friendly error messages
- **Keyboard shortcuts** - Enter to send, Shift+Enter for new line

## 📄 License

This project is for educational/demonstration purposes.

## 🤝 Support

If you encounter any issues:
1. Check the browser console (F12)
2. Check backend terminal logs
3. Verify all dependencies are installed
4. Ensure MongoDB is running
5. Check environment variables are set correctly

---

**Built with ❤️ for Smart Agriculture**
