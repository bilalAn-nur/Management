import React, { useEffect, useState } from "react";
import { tambahPegawai } from "../../api/PegawaiAPI";

const ModalInput = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    sektor: "",
    teknisi: "",
    nohp: "",
    mitra: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
      };
      await tambahPegawai(dataToSubmit);
      onSubmit(dataToSubmit);
      closeModal();
    } catch (error) {
      console.error("Error adding pegawai:", error);
    }
  };

  // Untuk menutup modal dengan menekan tombol Escape
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
          <h5 className="text-lg font-semibold text-black">Tambah Data</h5>
          <button onClick={onClose} className="text-black hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                NIK <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="Masukan nik pegawai"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Nama Pegawai <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukan nama pegawai"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Sektor <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="sektor"
                value={formData.sektor}
                onChange={handleChange}
                placeholder="Masukan nama sektor"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Teknisi <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="teknisi"
                value={formData.teknisi}
                onChange={handleChange}
                placeholder="Masukan teknisi"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Nomor HP <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="nohp"
                value={formData.nohp}
                onChange={handleChange}
                placeholder="Masukan Nomor Handphone"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black">
                Mitra <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="mitra"
                value={formData.mitra}
                onChange={handleChange}
                placeholder="Masukan Mitra"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
              />
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

export default ModalInput;
