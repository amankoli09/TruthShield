require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Simple in-memory user storage (in production, use a real database)
const users = new Map();
let userIdCounter = 1;

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  const user = users.get(id);
  done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let existingUser = null;
    for (const [id, user] of users) {
      if (user.googleId === profile.id) {
        existingUser = { id, ...user };
        break;
      }
    }

    if (existingUser) {
      return done(null, existingUser);
    }

    // Create new user
    const userId = userIdCounter++;
    const newUser = {
      id: userId.toString(),
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      picture: profile.photos[0].value,
      provider: 'google',
      createdAt: new Date().toISOString()
    };

    users.set(userId.toString(), newUser);
    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;
