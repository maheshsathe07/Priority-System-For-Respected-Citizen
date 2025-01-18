import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-lg text-gray-600">Page not found</p>
      <Link to="/" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md">
        Go Home
      </Link>
    </div>
  </div>
); 