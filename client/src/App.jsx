import { Navigate, Route, Routes } from "react-router-dom";

import PageTittle from "./components/PageTittle";
import SignIn from "./pages/Auth/SignIn";
import AuthLayout from "./Layout/AuthLayout";
import SignUp from "./pages/Auth/SignUp";
import AdminLayout from "./Layout/AdminLayout";

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

      {/* Auth Routes */}
      <Route
        path="/"
        element={
          <AuthLayout>
            <PageTittle title="Sign In | TailAdmin - Tailwind CSS Admin Dashboard Template" />
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
