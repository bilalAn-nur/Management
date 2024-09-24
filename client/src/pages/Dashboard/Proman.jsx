import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import axios from "axios";

const Proman = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const date = query.get("date");
  const [promanData, setPromanData] = useState([]);

  useEffect(() => {
    const fetchPromanData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_BACKEND_MONGODB +
            `/getPromanByDate?date=${date}`
        );
        if (response.data && response.data) {
          setPromanData(response.data); // Set promanData ke state
        } else {
          console.error("Data tidak valid:", response.data);
          setPromanData([]); // Set ke array kosong jika data tidak valid
        }
      } catch (error) {
        console.error("Error fetching PROMAN data:", error);
      }
    };

    if (date) {
      fetchPromanData();
    }
  }, [date]);

  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black ">
            Tabel Proman untuk Tanggal: {date}
          </h4>

          <div className="flex flex-col">
            <div className="grid grid-cols-5 rounded-sm bg-gray-2">
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
            </div>
            {promanData && promanData.length > 0 ? (
              promanData.map((item, index) => (
                <div
                  className={`grid grid-cols-5 ${
                    index === promanData.length - 1
                      ? ""
                      : "border-b border-stroke"
                  }`}
                  key={item._id} // Ganti key dengan item._id untuk keunikan
                >
                  <div className="p-2.5 xl:p-5">
                    <p className="text-black">{index + 1}</p>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                    <p className="text-black">
                      {item.promanData[0]?.promanName}
                    </p>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                    <p className="text-black">
                      {item.promanData[0].promanCategory}
                    </p>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                    <p className="text-black">{item.promanData[0].status}</p>
                  </div>
                  <div className="p-2.5 text-center xl:p-5">
                    <p className="text-black">
                      {item.promanData[0]?.petugas
                        ? item.promanData[0].petugas
                            .map((p) => p.name)
                            .join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black mb-4 mt-4">
                Tidak ada proman untuk tanggal ini.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Proman;
