import React, { useEffect } from "react";

const ModalViewProman = ({ isOpen, onClose, promanData }) => {
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

  const { date, promanDetail, inputBy } = promanData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-semibold text-black">Detail Proman</h5>
          <button onClick={onClose} className="text-black hover:text-gray-700">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black">
              <strong className="mr-14">Tanggal:</strong> {date || "N/A"}{" "}
              <span className="text-meta-1">*</span>
            </label>
          </div>
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black">
              <strong className="mr-2">Proman Name:</strong>{" "}
              {promanDetail?.promanName || "No Proman Name"}{" "}
              <span className="text-meta-1">*</span>
            </label>
          </div>
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black">
              <strong className="mr-13">Kategori:</strong>{" "}
              {promanDetail?.promanCategory || "No Category"}{" "}
              <span className="text-meta-1">*</span>
            </label>
          </div>
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black">
              <strong className="mr-17">Status:</strong>{" "}
              {promanDetail?.status || "No Status"}{" "}
              <span className="text-meta-1">*</span>
            </label>
          </div>
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black">
              <strong className="mr-14">Petugas:</strong>{" "}
              {promanDetail?.petugas?.map((p) => p.name).join(", ") || "N/A"}{" "}
              <span className="text-meta-1">*</span>
            </label>
          </div>
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black">
              <strong className="mr-4">Diimput oleh :</strong>{" "}
              {inputBy?.name || "Unknown"}{" "}
              <span className="text-meta-1">*</span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded hover:bg-gray-300 mr-2"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewProman;
