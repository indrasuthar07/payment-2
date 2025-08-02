import axios from 'axios';
import { SetUser, SetLoading, SetError, ClearUser } from '../UserSlice';

const API_URL = 'http://localhost:5000/api';

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(SetLoading(true));
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      dispatch(SetUser(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    dispatch(SetError(error.response?.data?.message || 'Login failed'));
    throw error;
  } finally {
    dispatch(SetLoading(false));
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(SetLoading(true));
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      dispatch(SetUser(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    dispatch(SetError(error.response?.data?.message || 'Registration failed'));
    throw error;
  } finally {
    dispatch(SetLoading(false));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(ClearUser());
};

export const checkAuth = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      dispatch(ClearUser());
      return;
    }

    // Set user from localStorage immediately
    dispatch(SetUser(JSON.parse(user)));

    // Verify token with backend
    try {
      await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      // If token verification fails, clear everything
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(ClearUser());
    }
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(ClearUser());
  }
}; 