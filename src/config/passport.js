import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Op } from 'sequelize';
import User from '../database/models/User.js';
import { sendVerificationEmail } from '../services/emailService.js';

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
}, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) { return done(err, false); }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      let user = await User.findOne({
        where: { [Op.or]: [{ googleId: profile.id }, { email }] }
      });

      if (!user) {
        // Brand new Google user — create unverified + send code
        const code = generateCode();
        user = await User.create({
          fullName: profile.displayName,
          email,
          googleId: profile.id,
          phone: `google_${profile.id}`, // temp placeholder
          role: 'PASSENGER',
          password: 'OAUTH_USER',
          isVerified: false,
          verificationCode: code
        });
        // Send verification email
        try { await sendVerificationEmail(email, profile.displayName, code); } catch {}
      } else {
        if (!user.googleId) { user.googleId = profile.id; await user.save(); }
      }

      return done(null, user);
    } catch (err) {
      console.error('Passport Google Error:', err);
      return done(err, null);
    }
  }
));