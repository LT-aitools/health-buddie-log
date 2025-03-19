// src/services/apiService.js

import config from '../config';

/**
 * This service handles all communication with your backend server
 */

// Helper function for making API requests
async function fetchWithAuth(endpoint, options = {}) {
  // Get user from localStorage
  const userJson = localStorage.getItem('healthBuddieUser');
  if (!userJson) {
    throw new Error('User not authenticated');
  }
  
  const user = JSON.parse(userJson);
  
  // Set up headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.phoneNumber}`,
    ...options.headers
  };
  
  try {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Verify a user's phone number and get access
export async function verifyUser(phoneNumber, verificationCode) {
  const response = await fetch(`${config.apiBaseUrl}/api/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber, verificationCode })
  });
  
  if (!response.ok) {
    throw new Error(`Verification failed: ${response.status}`);
  }
  
  return await response.json();
}

// Get a user's health logs
export async function getUserHealthLogs() {
  return fetchWithAuth('/api/health-logs');
}

// Get a user's weekly summary
export async function getWeeklySummary() {
  return fetchWithAuth('/api/weekly-summary');
}

// Generate a PDF report
export async function generatePdfReport(startDate, endDate) {
  return fetchWithAuth('/api/reports/generate', {
    method: 'POST',
    body: JSON.stringify({ 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString() 
    })
  });
}

// Default export
const apiService = {
  verifyUser,
  getUserHealthLogs,
  getWeeklySummary,
  generatePdfReport
};

export default apiService;