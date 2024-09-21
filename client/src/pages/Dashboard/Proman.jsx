import React from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";

const Proman = () => {
  const brandData = [
    {
      logo: "brandLogo1.svg",
      name: "Google",
      visitors: 3500,
      revenues: "5,768",
      sales: 590,
      conversion: 4.8,
    },
    {
      logo: "brandLogo2.svg",
      name: "Twitter",
      visitors: 2200,
      revenues: "4,635",
      sales: 467,
      conversion: 4.3,
    },
  ];
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black ">
            Tabel Proman
          </h4>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2  sm:grid-cols-5">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  No
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Tiket
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Jenis Tiket
                </h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Petugas
                </h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Tanggal
                </h5>
              </div>
            </div>

            {brandData.map((brand, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  key === brandData.length - 1 ? "" : "border-b border-stroke "
                }`}
                key={key}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img src={brand.logo} alt="Brand" />
                  </div>
                  <p className="hidden text-black  sm:block">{key}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black ">{brand.visitors}K</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">${brand.revenues}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black ">{brand.sales}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-meta-5">{brand.conversion}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Proman;
