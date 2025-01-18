import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/dashboard/Dashboard';
import AppointmentForm from './components/appointment/AppointmentForm';
import AppointmentsView from './components/appointment/AppointmentsView';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
      <Route path="/" element={
          <div>
            <Navbar />
            <Home />
          </div>
        } />
        <Route path="/login" element={
          <div>
            <Navbar />
            <AuthPage />
          </div>
        } />
        <Route path="/dashboard" element={
          <div>
          <Navbar />
          <Dashboard />
        </div>
        } />
        <Route path="/appointment/:serviceId" element={
          <div>
          <Navbar />
          <AppointmentForm />
        </div>
        } />
        <Route
          path="/appointments-view"
          element={
            sessionStorage.getItem('isAdmin') === 'true' ? (
              <div>
                <Navbar />
                <AppointmentsView />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/appointments" element={<AppointmentsView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;