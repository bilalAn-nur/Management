import React, { useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";

const ChangePassword = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    passwordBefore: "",
    passwordAfter: "",
    rePasswordAfter: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    let formErrors = {};

    // Validasi password
    if (!formData.passwordAfter) {
      formErrors.passwordAfter = "Password tidak boleh kosong";
    } else if (formData.passwordAfter.length < 8) {
      formErrors.passwordAfter = "Password harus minimal 8 karakter";
    }

    // Validasi password
    if (!formData.passwordBefore) {
      formErrors.passwordBefore = "Password tidak boleh kosong";
    } else if (formData.passwordBefore.length < 8) {
      formErrors.passwordBefore = "Password harus minimal 8 karakter";
    }

    // Validasi password
    if (!formData.rePasswordAfter) {
      formErrors.rePasswordAfter = "Password tidak boleh kosong";
    } else if (formData.rePasswordAfter.length < 8) {
      formErrors.rePasswordAfter = "Password harus minimal 8 karakter";
    }

    setErrors(formErrors);

    // Return true jika tidak ada error
    return Object.keys(formErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_BACKEND_MONGODB + "/changePassword",
          {
            id: user.id,
            passwordBefore: formData.passwordBefore,
            passwordAfter: formData.passwordAfter,
            rePasswordAfter: formData.rePasswordAfter,
          },
          {
            withCredentials: true,
          }
        );
        // Jika berhasil, Anda dapat melakukan redirect atau menampilkan pesan sukses
        alert("Password Berhasil Dirubah");
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Ganti Password" />

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black">
            Ganti Password
          </h4>
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black ">
                Password Sebelumnya
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="passwordBefore"
                  value={formData.passwordBefore}
                  onChange={handleChange}
                  placeholder="Masukan kata sandi sebelumnya"
                  className={`w-full ${
                    errors.passwordBefore ? "border-red-500" : "border-stroke"
                  } rounded-lg border bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:focus:border-primary`}
                />
                {errors.passwordBefore && (
                  <p style={{ color: "red" }}>{errors.passwordBefore}</p>
                )}

                <span className="absolute right-4 top-4">
                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                        fill=""
                      />
                      <path
                        d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black ">
                Masukan Password Baru
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="passwordAfter"
                  value={formData.passwordAfter}
                  onChange={handleChange}
                  placeholder="Masukan kata sandi yang baru"
                  className={`w-full ${
                    errors.passwordAfter ? "border-red-500" : "border-stroke"
                  } rounded-lg border bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:focus:border-primary`}
                />
                {errors.passwordAfter && (
                  <p style={{ color: "red" }}>{errors.passwordAfter}</p>
                )}

                <span className="absolute right-4 top-4">
                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                        fill=""
                      />
                      <path
                        d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black ">
                Masukan Kembali Password Baru
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="rePasswordAfter"
                  value={formData.rePasswordAfter}
                  onChange={handleChange}
                  placeholder="Masukan kata sandi yang baru"
                  className={`w-full ${
                    errors.rePasswordAfter ? "border-red-500" : "border-stroke"
                  } rounded-lg border bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:focus:border-primary`}
                />
                {errors.rePasswordAfter && (
                  <p style={{ color: "red" }}>{errors.rePasswordAfter}</p>
                )}

                <span className="absolute right-4 top-4">
                  <svg
                    className="fill-current"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                        fill=""
                      />
                      <path
                        d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </div>
            <div className="mb-5">
              <input
                type="submit"
                value="Ubah Password"
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
