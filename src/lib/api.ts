// src/lib/api.ts

import { Message } from './types';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('healthBuddieToken');

// Helper function to get phone number from localStorage
const getPhoneNumber = () => {
  try {
    const userJson = localStorage.getItem('healthBuddieUser');
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    return user.phoneNumber || null;
  } catch (error) {
    console.error('Error getting phone number:', error);
    return null;
  }
};

// Common headers with Authorization and Phone Number
const getHeaders = () => {
  const token = getToken();
  const phoneNumber = getPhoneNumber();
  
  console.log('Creating headers with phone number:', phoneNumber);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (phoneNumber) {
    headers['X-Phone-Number'] = phoneNumber;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('Final headers:', headers);
  return headers;
};

/**
 * Login with phone number
 * @param phoneNumber - User's phone number
 */
export const login = async (phoneNumber: string) => {
  try {
    console.log('Logging in with phone number:', phoneNumber);
    
    // For MVP, we'll simulate a successful login
    // In production, you'd make a real API call to authenticate
    
    // Create and store a user object
    const user = {
      id: `user-${Date.now()}`,
      phoneNumber: phoneNumber,
      createdAt: new Date(),
      lastActive: new Date(),
      verified: true
    };
    
    // Save user data to localStorage
    localStorage.setItem('healthBuddieUser', JSON.stringify(user));
    localStorage.setItem('healthBuddieToken', 'demo-token-' + Date.now());
    
    console.log('User saved to localStorage:', user);
    
    return {
      success: true,
      user
    };
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
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken() && !!getPhoneNumber();
};

/**
 * Get user health data
 * @param days - Number of days to look back (default: 7)
 */
export const getHealthData = async (days = 7) => {
  try {
    // Check for phone number before making the request
    const phoneNumber = getPhoneNumber();
    if (!phoneNumber) {
      console.error('No phone number available for API request');
      return {
        success: true,
        data: {
          exerciseLogs: getMockExerciseLogs(),
          foodLogs: getMockFoodLogs()
        }
      };
    }
    
    // Include the phone number as a query parameter
    const url = `${API_BASE_URL}/health-data?days=${days}&phoneNumber=${encodeURIComponent(phoneNumber)}`;
    console.log('Making API request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(errorText || 'Failed to get health data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching health data:', error);
    // Fall back to mock data on error
    return {
      success: true,
      data: {
        exerciseLogs: getMockExerciseLogs(),
        foodLogs: getMockFoodLogs()
      }
    };
  }
};

/**
 * Get recent messages
 */
export const getMessages = async (): Promise<{ success: boolean; messages?: Message[]; error?: string }> => {
  const userJson = localStorage.getItem('healthBuddieUser');
  let phoneNumber = null;
  
  if (userJson) {
    try {
      const userData = JSON.parse(userJson);
      phoneNumber = userData.phoneNumber;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  console.log('Getting messages for phone number:', phoneNumber);
  
  if (!phoneNumber) {
    console.error('No phone number found in localStorage');
    return { 
      success: false, 
      error: "No phone number available. Please log in again." 
    };
  }

  try {
    const url = `${API_BASE_URL}/messages?phoneNumber=${encodeURIComponent(phoneNumber)}`;
    console.log('Making request to:', url);
    console.log('With headers:', getHeaders());
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      return { 
        success: false, 
        error: errorData.error || `Failed to fetch messages: ${response.status}` 
      };
    }

    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    if (!data.messages || !Array.isArray(data.messages)) {
      console.error('Invalid response format:', data);
      return { 
        success: false, 
        error: "Invalid response format from server" 
      };
    }

    // Keep the original message data, just ensure required fields are present
    const messages = data.messages.map((msg: any) => {
      // Log all possible message content fields
      console.log('Message raw data:', {
        id: msg.id,
        content: msg.content,
        Body: msg.Body,
        body: msg.body,
        originalContent: msg.originalContent,
        rawContent: msg.rawContent,
        message: msg.message,
        text: msg.text,
        processed_data: msg.processed_data
      });

      return {
        ...msg, // Keep all original fields
        id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        // Prioritize raw message content
        content: msg.rawContent || msg.originalContent || msg.Body || msg.body || msg.content || msg.message || msg.text || '',
        timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
        type: msg.type || 'incoming',
        channel: msg.channel || 'whatsapp',
        processed: typeof msg.processed === 'boolean' ? msg.processed : true,
        category: msg.category || '',
        processed_data: msg.processed_data || {}
      };
    });

    console.log('Processed messages:', JSON.stringify(messages, null, 2));
    return { 
      success: true, 
      messages 
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { 
      success: false, 
      error: "Failed to connect to the server" 
    };
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    const phoneNumber = getPhoneNumber();
    if (!phoneNumber) {
      console.error('No phone number available for API test');
      return { 
        success: false, 
        error: new Error('No phone number available. Please log in again.') 
      };
    }

    const headers = getHeaders();
    console.log('Testing API connection with headers:', headers);

    const response = await fetch(`${API_BASE_URL}/messages?phoneNumber=${encodeURIComponent(phoneNumber)}`, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      console.error('API test failed:', errorData);
      throw new Error(errorData.error || 'API is not reachable');
    }
    
    return { success: true, message: 'API is reachable' };
  } catch (error) {
    console.error('API connection test failed:', error);
    return { success: false, error };
  }
};

// Mock data generators
function getMockExerciseLogs() {
  const today = new Date();
  
  return [
    {
      id: 'ex1',
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      duration: 30,
      type: 'running',
      distance: '3 miles'
    },
    {
      id: 'ex2',
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      duration: 45,
      type: 'cycling',
      distance: '10 miles'
    },
    {
      id: 'ex3',
      date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
      duration: 60,
      type: 'yoga',
      distance: ''
    }
  ];
}

function getMockFoodLogs() {
  const today = new Date();
  
  return [
    {
      id: 'food1',
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      foodItems: 'Salad with grilled chicken'
    },
    {
      id: 'food2',
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      foodItems: 'Oatmeal with berries and honey'
    },
    {
      id: 'food3',
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      foodItems: 'Pasta with tomato sauce'
    }
  ];
}

function getMockMessages() {
  const today = new Date();
  
  return [
    {
      id: 'msg1',
      content: 'I ran for 30 minutes today',
      timestamp: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      type: 'incoming',
      channel: 'whatsapp',
      processed: true,
      category: 'exercise',
      processed_data: {
        exercise: {
          duration: 30,
          type: 'running',
          distance: '3 miles'
        }
      }
    },
    {
      id: 'msg2',
      content: 'Had a salad with grilled chicken for lunch',
      timestamp: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      type: 'incoming',
      channel: 'whatsapp',
      processed: true,
      category: 'food',
      processed_data: {
        food: {
          description: 'Salad with grilled chicken'
        }
      }
    },
    {
      id: 'msg3',
      content: 'status',
      timestamp: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
      type: 'incoming',
      channel: 'whatsapp',
      processed: true
    }
  ];
}