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
        path="/cariProman"
        element={
          <AdminLayout>
            <PageTittle title="Cari Proman | TailAdmin" />
            <CariProman />
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
        path="/calendar"
        element={
          <AdminLayout>
            <PageTittle title="Calendar | TailAdmin" />
            <CalendarProman />
          </AdminLayout>
        }
      />

      <Route
        path="/promanExport"
        element={
          <AdminLayout>
            <PageTittle tittle="Export Proman | TailAdmin" />
            <ExportProman />
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

      <Route
        path="/jadwalPegawai"
        element={
          <AdminLayout>
            <PageTittle title="Jadwal Proman | TailAdmin" />
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
            <PageTittle title="Sign Up | TailAdmin" />
            <SignUp />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;
