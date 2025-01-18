import { FaIdCard, FaCar, FaExchangeAlt, FaFileAlt } from 'react-icons/fa';
import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'driving-license',
    title: 'Driving License',
    description: 'Apply for new license or renew existing one',
    icon: <FaIdCard className="h-6 w-6 text-indigo-600" />,
  },
  {
    id: 'vehicle-registration',
    title: 'Vehicle Registration',
    description: 'Register your new vehicle',
    icon: <FaCar className="h-6 w-6 text-indigo-600" />,
  },
  {
    id: 'vehicle-transfer',
    title: 'Vehicle Transfer',
    description: 'Transfer vehicle ownership',
    icon: <FaExchangeAlt className="h-6 w-6 text-indigo-600" />,
  },
  {
    id: 'permit',
    title: 'Vehicle Permit',
    description: 'Apply for various vehicle permits',
    icon: <FaFileAlt className="h-6 w-6 text-indigo-600" />,
  },
];