const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const controller = require('../controllers/auth');

passport.use(
  new LocalStrategy(function(username, password, done) {
    // User.findOne({ 'data.username': username }, function(err, user) {
    //   if (err) {
    //     return done(err)
    //   }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' })
    //   }
    //   // if (!user.validPassword(password)) {
    //   // return done(null, false, { message: 'Incorrect password.' })
    //   // }
    //   return done(null, user)
    // })
    controller.validateUser(username, password).then((feedback) => {
      if (feedback.valid) {
        return done(null, feedback.userData);
      } else {
        return done(null, false, feedback.errMessage);
      }
    });
  })
);
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
