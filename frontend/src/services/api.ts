import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const username = sessionStorage.getItem('auth_username');
  const password = sessionStorage.getItem('auth_password');

  if (username && password) {
    config.auth = { username, password };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_username');
      sessionStorage.removeItem('auth_password');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
