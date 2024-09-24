const mongoose = require("mongoose");

const promanSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Tanggal pencatatan
  promanData: [
    {
      promanName: { type: String, required: true }, // Nama Proman (misal ODP-CJA-FDB/068)
      promanCategory: { type: String, required: true }, // Kategori Proman (regular, hvc, dll.)
      status: { type: String, required: true },
      petugas: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pegawai", // Referensi ke model Pegawai
          required: true,
        },
      ],
    },
  ],
  inputBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referensi ke model User untuk mencatat siapa yang menginput
    required: true,
  },
});

const Proman = mongoose.model("Proman", promanSchema);

module.exports = Proman;
