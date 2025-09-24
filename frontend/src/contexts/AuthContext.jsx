import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
        loading: false
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api/auth';

  // Setup axios interceptor for auth token
  useEffect(() => {
    const token = localStorage.getItem('yatri_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token on app load
      verifyToken(token);
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: null });
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API_BASE}/me`);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.data, token }
      });
    } catch (error) {
      localStorage.removeItem('yatri_token');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'AUTH_ERROR', payload: 'Session expired' });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      const response = await axios.post(`${API_BASE}/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      const response = await axios.post(`${API_BASE}/verify-email`, { email, otp });
      
      const { user, access_token } = response.data;
      localStorage.setItem('yatri_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: access_token }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Verification failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      
      const { user, access_token } = response.data;
      localStorage.setItem('yatri_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: access_token }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const sendOTP = async (email) => {
    try {
      const response = await axios.post(`${API_BASE}/send-otp`, { email });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to send OTP';
      return { success: false, error: errorMessage };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      const response = await axios.post(`${API_BASE}/verify-otp`, { email, otp });
      
      const { user, access_token } = response.data;
      localStorage.setItem('yatri_token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: access_token }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'OTP verification failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`);
    } catch (error) {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem('yatri_token');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    register,
    verifyEmail,
    login,
    sendOTP,
    verifyOTP,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;