import axios from "axios";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/getUser",
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/changeRoleUser",
      { id: userId, role: newRole },
      { withCredentials: true }
    );
    alert("Role user berhasil diubah");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (userId, newStatus) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/changeApproveUser",
      { id: userId, approve: newStatus },
      { withCredentials: true }
    );
    alert("Status user berhasil diubah");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_API_BACKEND_MONGODB + "/deleteUser",
      { id: userId },
      { withCredentials: true }
    );
    alert("User Berhasil dihapus");
    window.location.reload();
    return response.data;
  } catch (error) {
    throw error;
  }
};
