const { google } = require('googleapis');

// Google OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
  process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback'
);

// Scopes for Google OAuth
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

// Generate Google OAuth URL
const getGoogleAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
};

// Get user info from Google
const getGoogleUserInfo = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
      verified_email: data.verified_email
    };
  } catch (error) {
    console.error('Error getting Google user info:', error);
    throw new Error('Failed to get user information from Google');
  }
};

module.exports = {
  oauth2Client,
  getGoogleAuthUrl,
  getGoogleUserInfo
};
