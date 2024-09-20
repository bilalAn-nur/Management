import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AuthLayout = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_BACKEND_MONGODB + "/protected",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []); // Array dependencies untuk memastikan efek hanya dipanggil sekali

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {children}
      </div>
    );
  } else {
    return <Navigate to="/dashboard" />;
  }
};

export default AuthLayout;
