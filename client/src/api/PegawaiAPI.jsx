import axios from "axios";

// Fungsi untuk mendapatkan semua pegawai
export const getAllPegawai = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/getAllPegawai",
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk menambah pegawai baru
export const tambahPegawai = async (pegawaiData) => {
  try {
    console.log(pegawaiData);
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/addPegawai",
      { name: pegawaiData },
      { withCredentials: true }
    );

    alert("Pegawai Berhasil ditambah");
    window.location.reload();
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mengupdate pegawai
export const updatePegawai = async (id, name) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/editPegawai",
      { id: id, name: name },
      { withCredentials: true }
    );
    alert("Pegawai Berhasil dirubah");
    window.location.reload();
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk menghapus pegawai
export const hapusPegawai = async (id) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/deletePegawai",
      { id: id },
      { withCredentials: true }
    );
    alert("Pegawai Berhasil dihapus");
    window.location.reload();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJumlahPegawai = async () => {
  try {
    const pegawaiList = await getAllPegawai();
    const pegawaiCount = pegawaiList.length;
    console.log(pegawaiCount);
    return pegawaiCount;
  } catch (error) {
    throw error;
  }
};
