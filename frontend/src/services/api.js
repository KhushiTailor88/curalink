import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
});

export const performResearch = async (data) => {
  const response = await api.post('/research', data);
  return response.data;
};

export const fetchHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export default api;
