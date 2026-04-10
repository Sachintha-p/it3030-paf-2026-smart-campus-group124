import api from './axios';

export const bookingService = {
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
  getMine: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
  approve: async (id) => {
    const response = await api.put(`/bookings/${id}/approve`);
    return response.data;
  },
  reject: async (id, reason) => {
    const response = await api.put(`/bookings/${id}/reject`, null, { params: { reason } });
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  }
};
