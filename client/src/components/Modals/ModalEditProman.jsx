import axios from "axios";
import React, { useState, useEffect } from "react";
import { getAllPegawai } from "../../api/PegawaiAPI";
import { updatePromanData } from "../../api/PromanAPI"; // Ensure API function is available
import { useUser } from "../../contexts/UserContext";

const ModalEditProman = ({ isOpen, onClose, onSubmit, promanData }) => {
  const [formData, setFormData] = useState({
    promanId: "",
    name: "",
    jenis: "",
    tanggal: "",
    userId: "",
    status: "",
  });
  const [petugasList, setPetugasList] = useState([]);
  const [petugasInputs, setPetugasInputs] = useState([]);

  const { user } = useUser();

  // Fetch Petugas (all pegawai)
  const getPetugas = async () => {
    try {
      const response = await getAllPegawai();
      setPetugasList(response.data);
    } catch (error) {
      console.error("Error fetching petugas:", error);
    }
  };

  // Populate form and petugas inputs when modal opens and promanData changes
  useEffect(() => {
    if (isOpen) {
      getPetugas();
      if (promanData) {
        setFormData({
          promanId: promanData.promanId || "",
          tanggal: promanData.date || "",
          name: promanData.promanDetails.promanName || "",
          status: promanData.promanDetails.status || "",
          jenis: promanData.promanDetails.promanCategory || "",
          userId: promanData.promanDetails.userId || "",
        });

        const currentPetugas = promanData.promanDetails.petugas
          ? promanData.promanDetails.petugas.map((petugas) => petugas._id)
          : [];
        setPetugasInputs(currentPetugas);
        console.log(promanData.promanDetails.petugas);
      }
    }
  }, [isOpen, promanData]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle petugas selection change
  const handlePetugasChange = (index, e) => {
    const newInputs = [...petugasInputs];
    newInputs[index] = e.target.value;
    setPetugasInputs(newInputs);
  };

  // Add new Petugas input field
  const handleAddPetugas = () => {
    setPetugasInputs([...petugasInputs, ""]); // Add empty string for new selection
  };

  const handleRemovePetugas = (index) => {
    const newInputs = [...petugasInputs];
    newInputs.splice(index, 1); // Remove petugas at the given index
    setPetugasInputs(newInputs);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const petugasData = petugasInputs.map((petugasId) => ({
        id: petugasId,
      }));
      const userId = user.id;

      const dataToSubmit = {
        ...formData,
        petugas: petugasData,
        userId: userId,
      };

      await updatePromanData(promanData._id, dataToSubmit); // Update the data
      onSubmit(dataToSubmit);
      onClose(); // Close modal after submitting
    } catch (error) {
      console.error("Error updating proman:", error);
    }
  };

  // Close modal on pressing Escape key
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

  if (!isOpen || !promanData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-semibold text-black">Edit Data PROMAN</h5>
          <button onClick={onClose} className="text-black hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            {/* Tanggal Input */}
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

            {/* Tiket Input */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Tiket <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan tiket"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
              />
            </div>

            {/* Jenis Select */}
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
                <option value="" disabled>
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

            {/* Dynamic Petugas Input */}
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
                    value={petugas || ""}
                    onChange={(e) => handlePetugasChange(index, e)}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                  >
                    <option value="" disabled>
                      Pilih Petugas
                    </option>
                    {petugasList.map((pegawai) => (
                      <option key={pegawai._id} value={pegawai._id}>
                        {pegawai.name}
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

export default ModalEditProman;
