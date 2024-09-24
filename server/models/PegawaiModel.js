const mongoose = require("mongoose");

const pegawaiSchema = new mongoose.Schema({
  nik: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sektor: { type: String, required: true },
  teknisi: { type: String, required: true },
  nohp: { type: String, required: true },
  mitra: { type: String, required: true },
});

const Pegawai = mongoose.model("Pegawai", pegawaiSchema);

module.exports = Pegawai;
