import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar, Users, Shield, Clock } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Appointment {
  _id: string;
  category: string;
  name: string;
  preferred_date: string;
  preferred_time: string;
  respected_citizen: boolean;
  service_id: string | null;
  make_announcement: boolean;
  announcement_message: string | null;
  service_type: string;
  service_title: string;
  vehicle_number?: string;
}

interface ApiResponse {
  data: Appointment[];
  limit: number;
  page: number;
}

const AppointmentsView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<'morning' | 'afternoon'>('morning');

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `http://localhost:5000/get-appointment-data?date=${selectedDate}`
      );
      console.log('Fetched appointments:', response.data.data);
      setAppointments(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  // Updated session filtering logic to handle "HH:00 AM/PM - HH:00 PM" format
  const filteredAppointments = appointments.filter(app => {
    const timeRange = app.preferred_time;
    const startTime = timeRange.split(' - ')[0]; // Gets "10:00 AM" part
    
    if (activeSession === 'morning') {
      return startTime.includes('AM');
    } else {
      return startTime.includes('PM');
    }
  });

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Army': 'bg-green-100 text-green-800',
      'Navy': 'bg-blue-100 text-blue-800',
      'Air Force': 'bg-indigo-100 text-indigo-800',
      'Civilian': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {appointment.service_type && (
            <div className="mb-3">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {appointment.service_type}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-medium text-gray-900">{appointment.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(appointment.category)}`}>
              {appointment.category}
            </span>
            {appointment.make_announcement && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                <svg 
                  className="h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" 
                  />
                </svg>
                Announcement Required
              </span>
            )}
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{appointment.preferred_time}</span>
          </div>
          
          {appointment.service_id && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Service ID:</span> {appointment.service_id}
            </div>
          )}

          {appointment.vehicle_number && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Vehicle Number:</span> {appointment.vehicle_number}
            </div>
          )}

          {appointment.make_announcement && appointment.announcement_message && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-md border border-yellow-100">
              <div className="flex items-start">
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">
                    Announcement Details:
                  </h4>
                  <p className="mt-1 text-sm text-yellow-700">
                    {appointment.announcement_message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const getSessionTimeRange = () => {
    return activeSession === 'morning' 
      ? '9:00 AM to 12:00 PM'
      : '2:00 PM to 5:00 PM';
  };

  const getGroupedAppointments = (appointments: Appointment[]) => {
    const respectedCitizens = appointments.filter(app => app.respected_citizen);
    const civilians = appointments.filter(app => !app.respected_citizen);
    return { respectedCitizens, civilians };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                {format(new Date(selectedDate), 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="text-gray-400" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
          
          {/* Toggles Container */}
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            {/* Session Toggle */}
            <div className="flex justify-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveSession('morning')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeSession === 'morning'
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Morning Session
              </button>
              <button
                onClick={() => setActiveSession('afternoon')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeSession === 'afternoon'
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Afternoon Session
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Display */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {activeSession === 'morning' ? 'Morning Session' : 'Afternoon Session'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {getSessionTimeRange()} • {filteredAppointments.length} appointments
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No appointments scheduled for this session.
                  </p>
                </div>
              ) : (
                <>
                  {/* Respected Citizens Section */}
                  <div>
                    <h3 className="text-lg font-medium text-indigo-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Respected Citizens
                    </h3>
                    <div className="space-y-4">
                      {getGroupedAppointments(filteredAppointments).respectedCitizens.length > 0 ? (
                        getGroupedAppointments(filteredAppointments).respectedCitizens.map((appointment) => (
                          <AppointmentCard 
                            key={appointment._id} 
                            appointment={appointment} 
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No respected citizens scheduled for this session</p>
                      )}
                    </div>
                  </div>

                  {/* Civilians Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Civilians
                    </h3>
                    <div className="space-y-4">
                      {getGroupedAppointments(filteredAppointments).civilians.length > 0 ? (
                        getGroupedAppointments(filteredAppointments).civilians.map((appointment) => (
                          <AppointmentCard 
                            key={appointment._id} 
                            appointment={appointment} 
                          />
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No civilians scheduled for this session</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsView;