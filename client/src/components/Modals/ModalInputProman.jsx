import axios from "axios";
import React, { useState, useEffect } from "react";
import { getAllPegawai } from "../../api/PegawaiAPI";
import { addPromanData } from "../../api/PromanAPI";
import { useUser } from "../../contexts/UserContext";

const ModalInputProman = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    jenis: "",
    tanggal: "",
    status: "",
    userId: "",
  });
  const [petugasList, setPetugasList] = useState([]); // Menyimpan daftar petugas
  const [petugasInputs, setPetugasInputs] = useState([]); // Menyimpan input petugas yang ditambahkan

  const { user } = useUser();

  const getPetugas = async () => {
    try {
      const response = await getAllPegawai();
      setPetugasList(response.data);
    } catch (error) {
      console.error("Error fetching petugas:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getPetugas(); // Ambil petugas saat modal dibuka
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePetugasChange = (index, e) => {
    const newInputs = [...petugasInputs];
    newInputs[index] = e.target.value;
    setPetugasInputs(newInputs);
  };

  const handleAddPetugas = () => {
    setPetugasInputs([...petugasInputs, ""]); // Tambah input baru
  };

  const handleRemovePetugas = (index) => {
    const newInputs = [...petugasInputs];
    newInputs.splice(index, 1); // Remove petugas at the given index
    setPetugasInputs(newInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const petugasData = petugasInputs.map((petugas) => ({
        id: petugas, // Ganti dengan ID atau data yang diperlukan
      }));
      const userId = user.id;

      const dataToSubmit = {
        ...formData,
        petugas: petugasData,
        userId: userId,
      };

      console.log(petugasData);

      await addPromanData(dataToSubmit);
      onSubmit(dataToSubmit);
      onClose(); // Tutup modal setelah submit
    } catch (error) {
      console.error("Error adding proman:", error);
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-semibold text-black">
            Tambah Data PROMAN
          </h5>
          <button onClick={onClose} className="text-black hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Tanggal <span className="text-meta-1">*</span>
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            </div>
            <hr className="mt-4 mb-4" />
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Tiket <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Jenis <span className="text-meta-1">*</span>
              </label>
              <select
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              >
                <option value="" selected disabled>
                  Pilih Jenis
                </option>
                <option value="Regular">Regular</option>
                <option value="HVC">HVC</option>
                <option value="SQM">SQM</option>
                <option value="MONET">MONET</option>
                <option value="Unspec">Unspec</option>
                <option value="Lapsung">Lapsung</option>
                <option value="Infracare">Infracare</option>
                <option value="Tangible">Tangible</option>
                <option value="Valins">Valins</option>
              </select>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Status <span className="text-meta-1">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              >
                <option value="" selected disabled>
                  Pilih Status
                </option>
                <option value="Close">Close</option>
                <option value="Not Close">Not Close</option>
              </select>
            </div>

            {/* Input Petugas Dinamis */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Petugas <span className="text-meta-1">*</span>
              </label>
              {petugasInputs.map((petugas, index) => (
                <div key={index} className="mb-4.5">
                  <label className="mb-2.5 block ml-5 mt-4 text-black">
                    Petugas {index + 1} <span className="text-meta-1">*</span>
                  </label>
                  <select
                    name={`petugas-${index}`}
                    value={petugas.name}
                    onChange={(e) => handlePetugasChange(index, e)}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                  >
                    <option value="" selected disabled>
                      Pilih Petugas
                    </option>
                    {petugasList.map((petugas) => (
                      <option key={petugas._id} value={petugas._id}>
                        {petugas.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x 4">
              <button
                type="button"
                onClick={handleAddPetugas}
                className="mt-2 mr-4 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600"
              >
                Tambah Petugas
              </button>
              <button
                type="button"
                onClick={handleRemovePetugas}
                className="mt-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
              >
                Hapus Petugas
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded hover:bg-gray-300 mr-2"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalInputProman;
