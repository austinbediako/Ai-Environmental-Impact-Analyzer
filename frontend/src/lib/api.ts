import axios from 'axios';

// Create a globally accessible Axios instance with dynamic base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// We can intercept requests here in the future if needed
// api.interceptors.request.use((config) => { ... });

export default api;
