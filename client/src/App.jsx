import { Navigate, Route, Routes } from "react-router-dom";

import PageTittle from "./components/PageTittle";
import SignIn from "./pages/Auth/SignIn";
import AuthLayout from "./Layout/AuthLayout";
import SignUp from "./pages/Auth/SignUp";
import AdminLayout from "./Layout/AdminLayout";
import Proman from "./pages/Dashboard/Proman";
import Pegawai from "./pages/Dashboard/Pegawai";
import AproveUser from "./pages/Dashboard/AproveUser";

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <AdminLayout>
            <PageTittle title="Dashboard | TailAdmin" />
          </AdminLayout>
        }
      />
      <Route
        path="/proman"
        element={
          <AdminLayout>
            <PageTittle title="Proman | TailAdmin" />
            <Proman />
          </AdminLayout>
        }
      />

      <Route
        path="/pegawai"
        element={
          <AdminLayout>
            <PageTittle title="Pegawai | TailAdmin" />
            <Pegawai />
          </AdminLayout>
        }
      />

      <Route
        path="/approve-user"
        element={
          <AdminLayout>
            <PageTittle title="Approve User | TailAdmin" />
            <AproveUser />
          </AdminLayout>
        }
      />

      {/* Auth Routes */}
      <Route
        path="/"
        element={
          <AuthLayout>
            <PageTittle title="Sign In | Tailwind" />
            <SignIn />
          </AuthLayout>
        }
      />
      <Route
        path="/sign-up"
        element={
          <AuthLayout>
            <PageTittle title="Sign Up | TailAdmin" />
            <SignUp />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;
