import axios from "axios";

// Fungsi untuk mendapatkan semua pegawai
export const getAllPegawai = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/getAllPegawai"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk menambah pegawai baru
export const tambahPegawai = async (pegawaiData) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/tambahPegawai",
      pegawaiData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mengupdate pegawai
export const updatePegawai = async (id, pegawaiData) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/editPegawai",
      pegawaiData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk menghapus pegawai
export const hapusPegawai = async (id) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/hapusPegawai"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
