import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import { services } from '../../utils/constants';
import { UserSession } from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = UserSession.getUser();
  const isAdmin = user?.email === "admin@admin.com";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {isAdmin && (
          <div className="mb-6">
            <button
              onClick={() => navigate('/appointments')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Appointments
            </button>
          </div>
        )}
        
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-2 gap-8 max-w-3xl">
            {services.map((service) => (
              <div key={service.id} className="w-full">
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}