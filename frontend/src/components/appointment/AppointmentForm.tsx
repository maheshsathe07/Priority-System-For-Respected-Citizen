// AppointmentForm.tsx
import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { services } from '../../utils/constants';
import { ServiceCategory } from '../../types';
import { UserSession } from '../../services/api';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, Transition } from '@headlessui/react';

export default function AppointmentForm() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services.find((s) => s.id === serviceId);
  const [isServiceIdVerified, setIsServiceIdVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifiedServiceData, setVerifiedServiceData] = useState<any>(null);
  const [makeAnnouncement, setMakeAnnouncement] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    serviceCategory: 'civilian' as ServiceCategory,
    serviceNumber: '',
    preferredDate: '',
    preferredTime: '',
    documents: [] as File[],
    vehicleNumber: '',
    serviceId: serviceId || '',
    serviceTitle: service?.title || ''
  });

  // Load user data from session on component mount
  useEffect(() => {
    const user = UserSession.getUser();
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name
      }));
    }
  }, []);

  useEffect(() => {
    console.log('Service:', service);
    console.log('ServiceId:', serviceId);
  }, [service, serviceId]);

  const verifyServiceId = async () => {
    setIsVerifying(true);
    try {
      const response = await axios.get(`http://localhost:5000/verify-service-id`, {
        params: { service_id: formData.serviceNumber },
      });

      if (response.data.is_valid) {
        setVerifiedServiceData(response.data);
        setIsServiceIdVerified(true);
        setIsModalOpen(true);
        toast.success('Service ID verified successfully!');
      } else {
        toast.error('Invalid Service ID');
      }
    } catch (error) {
      console.error('Error verifying Service ID:', error);
      toast.error('Service ID verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmServiceId = () => {
    setMakeAnnouncement(true);
    setShowMessageInput(true);
  };

  const handleRejectServiceId = () => {
    setMakeAnnouncement(false);
    setIsModalOpen(false);
  };

  const handleFinalConfirm = () => {
    setIsModalOpen(false);
    toast.info('Announcement will be made upon booking confirmation');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Reset service ID verification when service number changes
    if (name === 'serviceNumber') {
      setIsServiceIdVerified(false);
    }
    
    // Remove special handling for vehicle number
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.serviceCategory !== 'civilian' && !isServiceIdVerified) {
      toast.error('Please verify your Service ID first');
      return;
    }

    try {
      const timeMap: { [key: string]: string } = {
        'morning': '9:00 AM - 12:00 PM',
        'afternoon': '2:00 PM - 5:00 PM'
      };
  
      // Create URL with query parameters
      const params = new URLSearchParams({
        name: formData.name,
        category: formData.serviceCategory,
        preferred_date: formData.preferredDate,
        preferred_time: timeMap[formData.preferredTime],
        service_id: formData.serviceNumber,
        make_announcement: makeAnnouncement.toString(),
        announcement_message: announcementMessage,
        vehicle_number: formData.vehicleNumber,
        service_type: serviceId || '',
        service_title: service?.title || ''
      });
  
      console.log('Sending params:', Object.fromEntries(params.entries()));
  
      // Add service_number only if it exists
      if (formData.serviceNumber) {
        params.append('service_number', formData.serviceNumber);
      }
  
      const response = await axios.post(
        `http://localhost:5000/add-respected-citizen?${params.toString()}`, 
        null,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      if (response.data) {
        const successMessage = makeAnnouncement 
          ? 'Appointment booked successfully! An announcement will be made.'
          : 'Appointment booked successfully!';
        toast.success(successMessage);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Appointment error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to book appointment. Please try again.';
      toast.error(errorMessage);
    }
  };

  const isSunday = (date: string) => {
    const d = new Date(date);
    return d.getDay() === 0;
  };

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Book Appointment for {service.title}
          </h2>
          <p className="mt-2 text-gray-600">{service.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Category
            </label>
            <select
              name="serviceCategory"
              value={formData.serviceCategory}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="civilian">Civilian</option>
              <option value="military_personnel">Military Personnel</option>
              <option value="jawan">Jawan</option>
              <option value="veteran">Veteran</option>
            </select>
          </div>

          {formData.serviceCategory !== 'civilian' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Number
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="serviceNumber"
                    value={formData.serviceNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter service number (e.g. MIL12345)"
                  />
                  <button
                    type="button"
                    onClick={verifyServiceId}
                    disabled={!formData.serviceNumber || isVerifying}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify ID'}
                  </button>
                </div>
                {isServiceIdVerified && (
                  <p className="mt-1 text-sm text-green-600">Service ID verified ✓</p>
                )}
              </div>

              {isServiceIdVerified && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Format: MH 12 AB 1234"
                    maxLength={13}
                  />
                  <div className="mt-1 flex items-start">
                    <div className="flex-shrink-0">
                      <svg 
                        className="h-5 w-5 text-blue-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-500">
                      Providing your vehicle number helps us arrange convenient parking for your visit
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Date
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  if (isSunday(selectedDate)) {
                    toast.error('Appointments cannot be booked on Sundays');
                    return;
                  }
                  handleChange(e);
                }}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Time
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="">Select time</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Required Documents
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData((prev) => ({ ...prev, documents: files }));
              }}
              className="mt-1 block w-full py-2"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.serviceCategory !== 'civilian' && !isServiceIdVerified}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        Make an Announcement
                      </Dialog.Title>
                      <div className="mt-2">
                        {!showMessageInput ? (
                          <p className="text-sm text-gray-500">
                            Would you like to make an announcement for your visit? This will help the staff prepare for your arrival.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-500">
                              Would you like to add any specific details to your announcement?
                            </p>
                            <textarea
                              value={announcementMessage}
                              onChange={(e) => setAnnouncementMessage(e.target.value)}
                              placeholder="Enter any specific requirements or details (optional)"
                              className="w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                              rows={4}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    {!showMessageInput ? (
                      <>
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2"
                          onClick={handleConfirmServiceId}
                        >
                          Yes, make announcement
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={handleRejectServiceId}
                        >
                          No announcement needed
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 sm:col-start-2"
                          onClick={handleFinalConfirm}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={() => setShowMessageInput(false)}
                        >
                          Back
                        </button>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
    </div>
  );
}