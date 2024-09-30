const JadwalPegawai = require("../models/JadwalPegawaiModel");

exports.AddJadwalPegawai = async (req, res) => {
  try {
    const { date, month, year, schedule } = req.body;

    // Validasi data wajib
    if (!date || !month || !year || !schedule) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const newJadwal = new JadwalPegawai({
      date,
      month,
      year,
      schedule,
    });

    await newJadwal.save();

    return res
      .status(201)
      .json({ message: "Jadwal berhasil ditambahkan", jadwal: newJadwal });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menambahkan jadwal" });
  }
};
exports.getJadwalPegawai = async (req, res) => {
  try {
    const { month, year } = req.query;

    const jadwalpegawai = await JadwalPegawai.find({
      month,
      year,
    });
    res.status(200).json({
      success: true,
      data: jadwalpegawai,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data jadwal pegawai",
      error: error.message,
    });
  }
};
exports.deleteJadwalPegawai = async (req, res) => {
  try {
    const { jadwalPegawaiId } = req.query;

    const jadwalPegawai = await JadwalPegawai.findByIdAndDelete(
      jadwalPegawaiId
    );

    if (!jadwalPegawai) {
      return res.status(404).json({ message: "Pegawai tidak ditemukan!" });
    }

    res.status(200).json({
      success: true,
      message: "Pegawai berhasil dihapus!",
      data: jadwalPegawai,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus pegawai",
      error: error.message,
    });
  }
};
