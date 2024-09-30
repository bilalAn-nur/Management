import { Navigate, Route, Routes } from "react-router-dom";

import PageTittle from "./components/PageTittle";
import SignIn from "./pages/Auth/SignIn";
import AuthLayout from "./Layout/AuthLayout";
import SignUp from "./pages/Auth/SignUp";
import AdminLayout from "./Layout/AdminLayout";
import Proman from "./pages/Dashboard/Proman";
import Pegawai from "./pages/Dashboard/Pegawai";
import AproveUser from "./pages/Dashboard/AproveUser";
import CalendarProman from "./pages/Dashboard/CalendarProman";
import CariProman from "./pages/Dashboard/CariProman";
import ExportProman from "./pages/Dashboard/ExportProman";
import JadwalPegawai from "./pages/Dashboard/JadwalPegawai";
import ChangePassword from "./pages/Dashboard/ChangePassword";

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <AdminLayout>
            <PageTittle title="Dashboard | TelkomCijaura 1" />
          </AdminLayout>
        }
      />
      <Route
        path="/cariProman"
        element={
          <AdminLayout>
            <PageTittle title="Cari Proman | TelkomCijaura 1" />
            <CariProman />
          </AdminLayout>
        }
      />
      <Route
        path="/proman"
        element={
          <AdminLayout>
            <PageTittle title="Proman | TelkomCijaura 1" />
            <Proman />
          </AdminLayout>
        }
      />
      <Route
        path="/calendar"
        element={
          <AdminLayout>
            <PageTittle title="Calendar | TelkomCijaura 1" />
            <CalendarProman />
          </AdminLayout>
        }
      />

      <Route
        path="/pegawai"
        element={
          <AdminLayout>
            <PageTittle title="Pegawai | TelkomCijaura 1" />
            <Pegawai />
          </AdminLayout>
        }
      />
      <Route
        path="/change-password"
        element={
          <AdminLayout>
            <PageTittle title="Change Password | TelkomCijaura 1" />
            <ChangePassword />
          </AdminLayout>
        }
      />

      <Route
        path="/approve-user"
        element={
          <AdminLayout>
            <PageTittle title="Approve User | TelkomCijaura 1" />
            <AproveUser />
          </AdminLayout>
        }
      />

      <Route
        path="/jadwalPegawai"
        element={
          <AdminLayout>
            <PageTittle title="Jadwal Proman | TelkomCijaura 1" />
            <JadwalPegawai />
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
            <PageTittle title="Sign Up | TelkomCijaura 1" />
            <SignUp />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;
