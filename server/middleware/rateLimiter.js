// src/middlewares/rateLimiter.js
const rateLimit = require("express-rate-limit");

// Konfigurasi rate limiter
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 5, // Maksimal 5 permintaan per IP
  message: "Terlalu banyak percobaan login, coba lagi nanti.",
});

module.exports = {
  loginLimiter,
};
