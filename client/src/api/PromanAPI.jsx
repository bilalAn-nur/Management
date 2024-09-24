import axios from "axios";

export const addPromanData = async (data) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/addProman",
      {
        date: data.tanggal,
        promanData: [
          {
            promanName: data.name,
            promanCategory: data.jenis,
            status: data.status,
            petugas: data.petugas.map((petugas) => petugas.id),
          },
        ],
        userId: data.userId,
      },
      { withCredentials: true }
    );

    alert("Pegawai Berhasil ditambah");
    window.location.reload();
    if (response.ok) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error("Error adding Proman:", error);
  }
};

export const updatePromanData = async (id, promanDatas) => {
  try {
    // console.log("ini adalah :", promanData.promanId, " dan ", promanData);
    // { date, promanCategory, promanData, inputBy: userId },
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/editProman",
      {
        id: promanDatas.promanId,
        date: promanDatas.tanggal,
        promanData: [
          {
            promanName: promanDatas.name,
            promanCategory: promanDatas.jenis,
            status: promanDatas.status,
            petugas: promanDatas.petugas.map((petugas) => petugas.id),
          },
        ],
        userId: promanDatas.userId,
      },
      { withCredentials: true }
    );
    alert("Pegawai Berhasil dirubah");
    window.location.reload();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePromanData = async (id) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/deleteProman",
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

export const getAllProman = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/getAllProman",
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
