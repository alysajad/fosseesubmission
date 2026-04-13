import axios from 'axios';

// In Vite dev, route API calls through /api so /workshop/* remains available for frontend routes.
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : '');

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important for Django session cookies across domains
});

// Configure robust CSRF handling if using Django's Cookie-based CSRF protection
api.interceptors.request.use(config => {
  // Read CSRF token from cookies
  let csrfToken = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Django uses csrftoken by default
        if (cookie.substring(0, 10) === ('csrftoken=')) {
            csrfToken = decodeURIComponent(cookie.substring(10));
            break;
        }
    }
  }

  // If we found a token in cookies or window, pass it
  if (csrfToken) {
     config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
});

export default api;
