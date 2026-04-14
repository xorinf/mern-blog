import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Set dynamic base URL for external API calls, defaults to same-origin in local if not set
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:6767";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
