import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  console.log("data user: " + user);

  useEffect(() => {
    const storedUserName = localStorage.getItem("name");
    const storedUserEmail = localStorage.getItem("email");
    if (storedUserName) {
      setUser(storedUserName);
      setEmail(storedUserEmail);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
