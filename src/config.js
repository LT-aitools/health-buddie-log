// src/config.js

const config = {
    // Replace with your Fly.io app URL
    apiBaseUrl: 'https://health-tracker-mvp.fly.dev/',
    
    // For reference (no API keys needed in frontend)
    airtable: {
      baseName: 'Health Tracker Data'
    },
    
    // Verification settings
    auth: {
      // For demo, we'll accept this code for all verifications
      demoVerificationCode: '123456'
    }
  };
  
  export default config;