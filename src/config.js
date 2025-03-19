// src/config.js

const config = {
    // Replace with your Heroku app URL
    apiBaseUrl: 'https://health-tracker-new-app-7de8aa984308.herokuapp.com/',
    
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