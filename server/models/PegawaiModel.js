const mongoose = require("mongoose");

const pegawaiSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Pegawai = mongoose.model("Pegawai", pegawaiSchema);

module.exports = Pegawai;
