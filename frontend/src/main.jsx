import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Set dynamic base URL for external API calls, defaults to same-origin in local if not set
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:6767";
// Always send cookies with cross-domain requests
axios.defaults.withCredentials = true;

// Axios interceptor: attach Bearer token from localStorage to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
