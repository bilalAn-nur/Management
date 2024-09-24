import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ModalViewProman from "../../components/Modals/ModalViewProman";
import ModalEditProman from "../../components/Modals/ModalEditProman";
import { deletePromanData } from "../../api/PromanAPI";

const CariProman = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const date = query.get("date");
  const [promanData, setPromanData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedProman, setSelectedProman] = useState(null);

  const closeModalView = () => setIsModalViewOpen(false);
  const closeModalEdit = () => setIsModalEditOpen(false);

  useEffect(() => {
    const fetchPromanData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_BACKEND_MONGODB + `/getAllProman`
        );
        setPromanData(response.data);
        setFilteredData(response.data); // Set filtered data same as initial data
      } catch (error) {
        console.error("Error fetching PROMAN data:", error);
      }
    };

    fetchPromanData();
  }, [date]);

  // Handle search input changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on PROMAN name or category
    const filtered = promanData.filter((item) => {
      const name = item.promanData[0]?.promanName?.toLowerCase() || "";
      const category = item.promanData[0]?.promanCategory?.toLowerCase() || "";
      return name.includes(query) || category.includes(query);
    });

    setFilteredData(filtered); // Update filteredData state
  };

  const openViewModal = (proman) => {
    const selected = {
      promanDetail: proman.promanData[0],
      date: proman.date,
      inputBy: proman.inputBy,
    };
    setSelectedProman(selected);
    setIsModalViewOpen(true);
  };

  const openEditModal = (proman) => {
    const selectedEdit = {
      promanId: proman._id,
      promanDetails: proman.promanData[0],
      date: proman.date,
      inputBy: proman.inputBy,
    };
    console.log(selectedEdit);
    setSelectedProman(selectedEdit); // Set the selected proman for editing
    setIsModalEditOpen(true); // Open the edit modal
  };

  const handleDeleteProman = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus proman ini?"
    );
    if (confirmDelete) {
      try {
        await deletePromanData(id);
      } catch (error) {
        console.error("Error deleting pegawai:", error);
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Cari Proman" />

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black">
            Tabel Semua Proman
          </h4>

          {/* Search input */}
          <input
            type="text"
            className="mb-4 p-2 border rounded"
            placeholder="Cari berdasarkan nama atau kategori..."
            value={searchQuery}
            onChange={handleSearch}
          />

          <ModalViewProman
            isOpen={isModalViewOpen}
            onClose={closeModalView}
            promanData={selectedProman}
          />

          <ModalEditProman
            isOpen={isModalEditOpen}
            onClose={closeModalEdit}
            promanData={selectedProman}
          />

          <div className="flex flex-col">
            <div className="grid grid-cols-6 rounded-sm bg-gray-2">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  No
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Tiket Proman
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Kategori
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Status
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Petugas
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Action
                </h5>
              </div>
            </div>

            {/* Display filtered data */}
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div
                  className={`grid grid-cols-6 ${
                    index === filteredData.length - 1
                      ? ""
                      : "border-b border-stroke"
                  }`}
                  key={item._id}
                >
                  <div className="p-2.5 xl:p-5">
                    <p className="text-black">{index + 1}</p>
                  </div>
                  <div className="p-2.5 xl:p-5">
                    <p className="text-black">
                      {item.promanData[0]?.promanName}
                    </p>
                  </div>
                  <div className="p-2.5 ml-6 xl:p-5">
                    <p className="text-black">
                      {item.promanData[0]?.promanCategory}
                    </p>
                  </div>
                  <div className="p-2.5 ml-7 xl:p-5">
                    <p className="text-black">{item.promanData[0]?.status}</p>
                  </div>
                  <div className="p-2.5 ml-8 xl:p-5">
                    <p className="text-black">
                      {item.promanData[0]?.petugas
                        ? item.promanData[0].petugas
                            .map((p) => p.name)
                            .join(", ")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-2.5 ml-8 xl:p-5">
                    <button
                      className="hover:text-primary mr-2"
                      onClick={() => openViewModal(item)}
                    >
                      {/* View button SVG */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          fill=""
                        />
                        <path
                          d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button
                      className="hover:text-primary mr-2"
                      onClick={() => openEditModal(item)}
                    >
                      {/* Edit button SVG or content */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                      </svg>
                    </button>
                    <button
                      className="hover:text-primary"
                      onClick={() => handleDeleteProman(item._id)}
                    >
                      {/* Delete button SVG */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black mb-4 mt-4">Tidak ada data proman</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CariProman;
