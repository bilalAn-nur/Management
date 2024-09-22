const Proman = require("../models/PromanModel");

exports.addProman = async (req, res) => {
  try {
    const { date, promanCategory, promanData, inputBy } = req.body;

    const newProman = new Proman({
      date,
      promanCategory,
      promanData,
      inputBy,
    });

    await newProman.save();
    res.status(201).json({ message: "Data Proman berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah data Proman", error });
  }
};
