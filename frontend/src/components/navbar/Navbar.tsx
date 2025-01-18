import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserSession } from '../../services/api';
import AdminLoginModal from '../auth/AdminLoginModal';
import logo from '../../assets/emblem.png'; // Add your logo image here

export default function Navbar() {
  const navigate = useNavigate();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const isLoggedIn = UserSession.getUser() !== null;
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    UserSession.clearUser();
    sessionStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <NavLink
              to="/"
              className="flex items-center space-x-3 hover:text-indigo-200 transition duration-300"
            >
              <img
                className="h-12 w-auto"
                src={logo}
                alt="Logo"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Parivahan Seva</span>
                <span className="text-sm text-white opacity-90">Road and Transport Office</span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300"
              style={({ isActive }) => ({
                borderBottom: isActive ? '2px solid white' : 'none',
              })}
            >
              Home
            </NavLink>
            {isLoggedIn && (
              <NavLink
                to="/dashboard"
                className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300"
                style={({ isActive }) => ({
                  borderBottom: isActive ? '2px solid white' : 'none',
                })}
              >
                Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/appointments-view"
                className="text-white text-lg font-medium hover:text-indigo-200 transition duration-300"
                style={({ isActive }) => ({
                  borderBottom: isActive ? '2px solid white' : 'none',
                })}
              >
                Appointments
              </NavLink>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn && !isAdmin && (
              <>
                <NavLink
                  to="/login"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium text-sm shadow hover:bg-indigo-100 transition duration-300"
                >
                  Login
                </NavLink>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium text-sm shadow hover:bg-indigo-100 transition duration-300"
                >
                  Admin Login
                </button>
              </>
            )}
            {(isLoggedIn || isAdmin) && (
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium text-sm shadow hover:bg-red-100 transition duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </nav>
  );
}
