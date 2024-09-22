import React, { useState, useEffect } from "react";
import { updatePegawai } from "../../api/PegawaiAPI";

const ModalEditPegawai = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ id: initialData._id, name: initialData.name });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePegawai(formData.id, formData.name);
      closeModal(); // Tutup modal setelah submit
    } catch (error) {
      console.error("Error adding pegawai:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-semibold text-black">Edit Data</h5>
          <button onClick={onClose} className="text-black hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
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
          </form>
        </div>

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

export default ModalEditPegawai;
