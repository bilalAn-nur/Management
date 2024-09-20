import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./css/index.css";
import "./css/satoshi.css";
import { BrowserRouter as Router } from "react-router-dom";

import { CookiesProvider } from "react-cookie";
import { UserProvider } from "./contexts/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <UserProvider>
        <Router>
          <App />
        </Router>
      </UserProvider>
    </CookiesProvider>
  </StrictMode>
);
