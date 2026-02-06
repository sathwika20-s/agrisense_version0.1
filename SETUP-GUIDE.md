# 🚀 Quick Setup Guide - Smart Agriculture Studio

## Step-by-Step Installation

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd Frontend
npm install
```

### Step 2: Start MongoDB

**Windows:**
- If MongoDB is installed as a service, it should start automatically
- Or run manually: `mongod`
- Verify it's running: `mongosh` (should connect successfully)

**Alternative:** Use MongoDB Atlas (cloud) and update `MONGO_URI` in `backend/.env`

### Step 3: Start Backend Server

```bash
cd backend
npm start
```

**Expected Output:**
```
✅ MongoDB Connected
🚀 Server running on port 5000
📍 API URL: http://localhost:5000/api
```

**If MongoDB connection fails:**
- Check if MongoDB is running
- Verify `MONGO_URI` in `backend/.env`
- For local MongoDB: `mongodb://127.0.0.1:27017/agrisense`

### Step 4: Start Frontend (New Terminal)

```bash
cd Frontend
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open Browser

Navigate to: `http://localhost:5173`

---

## 🎯 Using the Application

### Dashboard
- Overview of all features
- Backend health status
- Quick navigation

### Climate Insights
1. Enter latitude and longitude (e.g., 12.9716, 77.5946)
2. Optionally add area name
3. Click "Predict climate"
4. View weather data and climate zone

### Crop Advisor
1. Enter temperature (°C) and humidity (%)
2. Optionally add rainfall, season, soil type
3. Click "Recommend crops"
4. View ranked crop recommendations with suitability scores

### Disease Scanner
1. Upload a crop leaf image (PNG/JPG, max 5MB)
2. Optionally specify crop name
3. Click "Scan disease"
4. View detection results, treatment options, and prevention tips

### Smart Chatbot
1. Type your question in the textarea
2. Press Enter to send (Shift+Enter for new line)
3. Get AI-powered responses
4. Use "Clear chat" to reset conversation

---

## 🔧 Troubleshooting

### "Cannot connect to backend"
- ✅ Check backend is running on port 5000
- ✅ Check `http://localhost:5000/api/health` in browser
- ✅ Verify CORS is enabled in `backend/server.js`
- ✅ Check browser console for errors

### "MongoDB connection error"
- ✅ Start MongoDB service
- ✅ Check `MONGO_URI` in `backend/.env`
- ✅ Try: `mongosh` to test connection
- ✅ For cloud MongoDB, use full connection string

### "Chatbot not responding"
- ✅ Check `ANTHROPIC_API_KEY` in `backend/.env`
- ✅ Without API key, chatbot uses fallback responses
- ✅ Check backend terminal for errors
- ✅ Verify connection status indicator (green = connected)

### "Disease detection fails"
- ✅ Ensure `backend/uploads/` folder exists
- ✅ Check file size (max 5MB)
- ✅ Verify image format (PNG, JPG, JPEG only)
- ✅ Check backend logs for multer errors

### Port already in use
- **Backend (5000):** Change `PORT` in `backend/.env`
- **Frontend (5173):** Vite will auto-select next available port

---

## 📋 API Testing

Test backend endpoints directly:

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Climate Prediction:**
```bash
curl -X POST http://localhost:5000/api/climate/predict \
  -H "Content-Type: application/json" \
  -d '{"latitude": 12.9716, "longitude": 77.5946}'
```

**Crop Recommendation:**
```bash
curl -X POST http://localhost:5000/api/crops/recommend \
  -H "Content-Type: application/json" \
  -d '{"temperature": 28, "humidity": 70}'
```

**Chatbot Query:**
```bash
curl -X POST http://localhost:5000/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"message": "What crops grow well in summer?", "user_id": "test"}'
```

---

## 🎨 Features Overview

✅ **Real-time connection status** - See if backend is connected  
✅ **Auto-scroll chat** - Messages automatically scroll into view  
✅ **Typing indicators** - Visual feedback while AI is thinking  
✅ **Error handling** - User-friendly error messages  
✅ **Responsive design** - Works on desktop and mobile  
✅ **Keyboard shortcuts** - Enter to send, Shift+Enter for new line  
✅ **File upload** - Drag & drop or click to upload images  
✅ **Conversation history** - Maintains context across messages  

---

## 📞 Support

If you encounter issues:

1. **Check Backend Logs** - Terminal running `npm start` in backend folder
2. **Check Frontend Console** - Browser DevTools (F12)
3. **Verify Setup** - Run `node verify-setup.js` in project root
4. **Check Dependencies** - Ensure `npm install` completed successfully
5. **Verify MongoDB** - Run `mongosh` to test database connection

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] MongoDB is running (`mongosh` works)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd Frontend && npm install`)
- [ ] Backend server starts without errors
- [ ] Frontend dev server starts without errors
- [ ] `http://localhost:5000/api/health` returns JSON
- [ ] Browser can access `http://localhost:5173`
- [ ] No CORS errors in browser console
- [ ] `.env` file exists in `backend/` folder

---

**Happy Farming! 🌾**
