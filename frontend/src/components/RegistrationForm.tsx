import React, { useState } from 'react';

type ServiceCategory = 'civilian' | 'military_personnel' | 'jawan' | 'veteran';

interface FormData {
  name: string;
  age: string;
  mobile: string;
  email: string;
  serviceCategory: ServiceCategory;
  serviceNumber?: string;
  rtoService: string;
  preferredDate: string;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    mobile: '',
    email: '',
    serviceCategory: 'civilian',
    serviceNumber: '',
    rtoService: '',
    preferredDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getGreeting = () => {
    switch (formData.serviceCategory) {
      case 'military_personnel':
        return 'Jai Hind! Welcome to RTO Services';
      case 'jawan':
        return 'Jai Hind! Thank you for your service to our nation';
      case 'veteran':
        return 'Jai Hind! We are honored to serve you';
      default:
        return 'Welcome to RTO Services';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">RTO Appointment Registration</h1>
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-xl text-center font-semibold">{getGreeting()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            pattern="[0-9]{10}"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Service Category</label>
          <select
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="civilian">Civilian</option>
            <option value="military_personnel">Military Personnel</option>
            <option value="jawan">Jawan</option>
            <option value="veteran">Veteran</option>
          </select>
        </div>

        {formData.serviceCategory !== 'civilian' && (
          <div>
            <label className="block text-sm font-medium mb-1">Service Number</label>
            <input
              type="text"
              name="serviceNumber"
              value={formData.serviceNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">RTO Service Required</label>
          <select
            name="rtoService"
            value={formData.rtoService}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a service</option>
            <option value="driving_license">Driving License</option>
            <option value="vehicle_registration">Vehicle Registration</option>
            <option value="license_renewal">License Renewal</option>
            <option value="vehicle_transfer">Vehicle Transfer</option>
            <option value="permit">Vehicle Permit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preferred Date</label>
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}