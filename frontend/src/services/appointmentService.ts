import axios from 'axios';
import { config } from '../config/config';

export const appointmentService = {
  async getAppointments(date: string) {
    const response = await axios.get(`${config.API_URL}/get-appointment-data`, {
      params: { date }
    });
    return response.data;
  },

  async createAppointment(appointmentData: any) {
    const response = await axios.post(`${config.API_URL}/add-respected-citizen`, appointmentData);
    return response.data;
  }
}; 