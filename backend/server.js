// backend/server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
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
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use("/uploads", express.static("uploads"));

/* =========================
   MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/* =========================
   Multer Configuration
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) cb(null, true);
    else cb(new Error("Only .png, .jpg, .jpeg files allowed"));
  }
});

// Make upload available to routes
app.locals.upload = upload;

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
