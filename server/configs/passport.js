const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const controller = require('../controllers/auth');

// Local Strategy
passport.use(
  new LocalStrategy(function(username, password, done) {
    controller.validateUser(username, password).then((feedback) => {
      if (feedback.valid) {
        return done(null, feedback.userData);
      } else {
        return done(null, false, feedback.errMessage);
      }
    });
  })
);
// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/googleRedirect'
    },
    function(accessToken, refreshToken, profile, cb) {
      // console.log('profile', profile);
      controller.googleAuth(profile).then((feedback) => {
        return cb(null, feedback.user);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
