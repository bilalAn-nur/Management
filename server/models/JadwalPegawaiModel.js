const mongoose = require("mongoose");

const jadwalPegawaiSchema = new mongoose.Schema({
  date: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: String, required: true },
  schedule: [
    {
      pagi: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pegawai",
          required: true,
        },
      ],
      piket: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pegawai",
          required: true,
        },
      ],
      libur: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pegawai",
          required: true,
        },
      ],
    },
  ],
});

const JadwalPegawai = mongoose.model("JadwalPegawai", jadwalPegawaiSchema);

module.exports = JadwalPegawai;
