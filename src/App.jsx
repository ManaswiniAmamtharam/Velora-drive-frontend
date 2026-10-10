
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import SellVehicle from "./pages/SellVehicle";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Enquiries from "./pages/Enquiries";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />

        <Route path="/vehicles" element={
          <ProtectedRoute><Vehicles /></ProtectedRoute>
        } />

        <Route path="/vehicles/:id" element={
          <ProtectedRoute><VehicleDetails /></ProtectedRoute>
        } />

        <Route path="/sell" element={
          <ProtectedRoute><SellVehicle /></ProtectedRoute>
        } />

        <Route path="/favorites" element={
          <ProtectedRoute><Favorites /></ProtectedRoute>
        } />

        <Route path="/compare" element={
          <ProtectedRoute><Compare /></ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/enquiries" element={
          <ProtectedRoute><Enquiries /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
