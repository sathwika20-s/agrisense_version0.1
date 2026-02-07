// backend/server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
// Import routes
const climateRoutes = require("./routes/climate");
const cropRoutes = require("./routes/crops");
const diseaseRoutes = require("./routes/disease");
const chatbotRoutes = require("./routes/chatbot");

// Initialize app
const app = express();
// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174', "https://agrisense-version0-1-git-main-sathwika20-s-projects.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Routes
========================= */
app.use("/api/climate", climateRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/chatbot", chatbotRoutes);


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Smart Agriculture API is running",
    time: new Date().toISOString()
  });
});

/* =========================
   Error Handling
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


//git path
// const path = require("path");
// const express = require("express");

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});


module.exports = app;
