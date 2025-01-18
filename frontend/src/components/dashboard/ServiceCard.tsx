import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Service } from '../../types';

export default function ServiceCard({ id, title, description, icon }: Service) {
  const navigate = useNavigate();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate(`/appointment/${id}`)}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}