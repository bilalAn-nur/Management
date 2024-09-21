const express = require("express");
const {
  signUp,
  signIn,
  signOut,
  fetchDataUser,
} = require("../controllers/UserController");
const router = express.Router();
const { loginLimiter } = require("../middleware/rateLimiter");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  ReadPegawai,
  AddPegawai,
  EditPegawai,
  DeletePegawai,
} = require("../controllers/PegawaiController");

// User Route
router.post("/signup", signUp);
router.post("/signin", loginLimiter, signIn);
router.post("/signout", signOut);

router.get("/fetchDataUser", fetchDataUser, authMiddleware);

// Protect Middleware
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully!" });
});

// Pegawai Route
router.get("/getAllPegawai", authMiddleware, ReadPegawai, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});
router.post("/addPegawai", authMiddleware, AddPegawai, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});

router.post("/editPegawai", authMiddleware, EditPegawai, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});

router.post("/deletePegawai", authMiddleware, DeletePegawai, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});

module.exports = router;
