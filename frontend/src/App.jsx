import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Village from "./pages/Village";
import Gala from "./pages/Gala";
import Tombola from "./pages/Tombola";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Conditions from "./pages/Conditions";
import Confidentialite from "./pages/Confidentialite";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import InscriptionsAdmin from "./pages/Admin/Inscription";
import EventSettings from "./pages/Admin/EventSettings";
import Monitoring from "./pages/Admin/Monitoring";
import TombolaManagement from "./pages/Admin/TombolaManagement";
import ParticipantRoute from "./components/ParticipantRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="village" element={<Village />} />
          <Route path="gala" element={<Gala />} />
          <Route path="tombola" element={<Tombola />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="dashboard"
            element={
              <ParticipantRoute>
                <Dashboard />
              </ParticipantRoute>
            }
          />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="conditions" element={<Conditions />} />
          <Route path="confidentialite" element={<Confidentialite />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="admin/inscriptions"
            element={
              <AdminRoute>
                <InscriptionsAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="admin/events"
            element={
              <AdminRoute>
                <EventSettings />
              </AdminRoute>
            }
          />
          <Route
            path="admin/tombola"
            element={
              <AdminRoute>
                <TombolaManagement />
              </AdminRoute>
            }
          />
          <Route
            path="admin/monitoring"
            element={
              <AdminRoute>
                <Monitoring />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
