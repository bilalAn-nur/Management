const Proman = require("../models/PromanModel");

exports.addProman = async (req, res) => {
  try {
    const { date, promanCategory, promanData, userId } = req.body;

    if (!date) return res.status(400).json({ message: "Tanggal harus diisi" });

    const newProman = new Proman({
      date,
      promanCategory,
      promanData,
      inputBy: userId,
    });

    await newProman.save();
    res.status(201).json({ message: "Data Proman berhasil ditambahkan" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gagal menambah data Proman", error });
  }
};

exports.getPromanByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const proman = await Proman.find({ date })
      .populate("inputBy")
      .populate("promanData.petugas");

    if (!proman) {
      return res
        .status(404)
        .json({ message: "Data PROMAN tidak ditemukan untuk tanggal ini" });
    }

    res.json(proman);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

exports.getAllProman = async (req, res) => {
  try {
    const { date } = req.query;
    const proman = await Proman.find()
      .populate("inputBy")
      .populate("promanData.petugas");

    if (!proman) {
      return res.status(404).json({ message: "Data PROMAN tidak ditemukan " });
    }

    res.json(proman);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

exports.editProman = async (req, res) => {
  try {
    const promanId = req.body.id;

    const { date, promanCategory, promanData, userId } = req.body;

    if (!date) return res.status(400).json({ message: "Tanggal harus diisi" });

    const editProman = await Proman.findByIdAndUpdate(
      promanId,
      { date, promanCategory, promanData, inputBy: userId },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Proman berhasil diupdate!",
      data: editProman,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
};

exports.deleteProman = async (req, res) => {
  try {
    const promanId = req.body.id;

    const proman = await Proman.findByIdAndDelete(promanId);

    if (!proman) {
      return res.status(404).json({ message: "proman tidak ditemukan!" });
    }

    res.status(200).json({
      success: true,
      message: "Proman berhasil dihapus!",
      data: proman,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus pegawai",
      error: error.message,
    });
  }
};
