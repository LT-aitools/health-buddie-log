// src/lib/api.ts

// Your specific Heroku URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';


// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('healthBuddieToken');

// Common headers with Authorization
const getHeaders = () => {
  const token = getToken();
  const userJson = localStorage.getItem('healthBuddieUser');
  const user = userJson ? JSON.parse(userJson) : {};
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'X-Phone-Number': user.phoneNumber || '' // Add phone number to headers
  };
};

/**
 * Login with phone number
 * @param phoneNumber - User's phone number
 */
export const login = async (phoneNumber: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem('healthBuddieToken', data.token);
      localStorage.setItem('healthBuddieUser', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout - clear token and user data
 */
export const logout = () => {
  localStorage.removeItem('healthBuddieToken');
  localStorage.removeItem('healthBuddieUser');
};

/**
 * Check if user is logged in
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get user health data
 * @param days - Number of days to look back (default: 7)
 */
export const getHealthData = async (days = 7) => {
  try {
    const response = await fetch(`${API_BASE_URL}/health-data?days=${days}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get health data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};

/**
 * Get recent messages
 */
export const getMessages = async () => {
  try {
    const userJson = localStorage.getItem('healthBuddieUser');
    const user = userJson ? JSON.parse(userJson) : {};
    
    console.log('Retrieving messages for phone number:', user.phoneNumber);
    
    if (!user.phoneNumber) {
      throw new Error('Phone number is missing. Please log in again.');
    }
    
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Messages fetch error:', errorText);
      throw new Error(errorText || 'Failed to get messages');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Create a simple test function to check if the API is reachable
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error('API is not reachable');
    }
    
    return { success: true, message: 'API is reachable' };
  } catch (error) {
    console.error('API connection test failed:', error);
    return { success: false, error };
  }
};