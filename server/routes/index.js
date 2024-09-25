const express = require("express");
const {
  signUp,
  signIn,
  signOut,
  fetchDataUser,
  getUser,
  changeRole,
  changeApprove,
  deleteUser,
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
const {
  addProman,
  getPromanByDate,
  getAllProman,
  editProman,
  deleteProman,
} = require("../controllers/PromanController");
const {
  AddJadwalPegawai,
  getJadwalPegawai,
  deleteJadwalPegawai,
} = require("../controllers/JadwalPegawaiController");

// User Route
router.post("/signup", signUp);
router.post("/signin", loginLimiter, signIn);
router.post("/signout", signOut);

router.get("/fetchDataUser", fetchDataUser, authMiddleware);

// Protect Middleware
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully!" });
});

// ApproveRoute
router.get("/getUser", authMiddleware, getUser, (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully!" });
});
router.post("/changeRoleUser", authMiddleware, changeRole, (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully!" });
});
router.post("/changeApproveUser", authMiddleware, changeApprove, (req, res) => {
  res.status(200).json({ message: "Protected route accessed successfully!" });
});
router.post("/deleteUser", authMiddleware, deleteUser, (req, res) => {
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

// Proman Route
router.post("/addProman", authMiddleware, addProman, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});
router.get("/getPromanByDate", getPromanByDate, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});
router.get("/getAllProman", getAllProman, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});
router.post("/editProman", authMiddleware, editProman, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});
router.post("/deleteProman", authMiddleware, deleteProman, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});

// Router Jadwal Pegawai
router.post("/addJadwalPegawai", AddJadwalPegawai, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});
router.get("/getJadwalPegawai", getJadwalPegawai, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});
router.post("/deleteJadwalPegawai", deleteJadwalPegawai, (req, res) => {
  res.status(200).json({ message: "izin diberikan!" });
});

module.exports = router;
