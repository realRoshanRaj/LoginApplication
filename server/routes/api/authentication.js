const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('./../../controllers/auth');

router.post('/uniqueUsername', function(req, res, next) {
  if (req.method === 'POST') {
    const username = req.body.username;
    controller.username_unique(username).then((isUnique) => {
      res.json({ isUnique });
    });
  }
});

router.post('/register', function(req, res, next) {
  controller
    .register(req.body.username, req.body.email, req.body.password)
    .then((response) => {
      if (!response.valid) {
        res.json({ loggedIn: false });
      } else {
        req.login(response.user, function(error) {
          if (error) return next(error);
          res.json({ loggedIn: true });
        });
      }
    });
});
// local login
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/api/auth/loginFailed'
  }),
  function(req, res) {
    res.json({ loggedIn: true, user: req.user });
  }
);

// google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/googleRedirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect profile.
    res.redirect('/profile');
  }
);

router.get('/loginFailed', function(req, res) {
  res.json({ loggedIn: false });
});

router.get('/logout', function(req, res, next) {
  req.logout();
  const redirect = require('url').parse(req.url, { parseQueryString: true })
    .query.redirect;
  if (redirect) {
    res.redirect('/' + redirect);
  } else {
    res.redirect('/');
  }
});
// ------------------------AUTHENTICATION ABOVE-------------------------------
router.post('/getEmail', function(req, res) {
  // res.send(controller.getEmail(req.user.data.email));
  if (req.body.email) {
    res.json({ email: controller.getEmail(req.body.email) });
  } else {
    res.json({ email: 'no email' });
  }
});

router.post('/updateEmail', function(req, res) {
  controller.updateEmail(req.user._id, req.body.email).then((response) => {
    res.json(response);
  });
});

router.post('/changePassword', function(req, res) {
  controller
    .changePassword(req.user, req.body.currentPassword, req.body.newPassword)
    .then((response) => {
      res.json(response);
    });
});

router.delete('/deleteUser', function(req, res) {
  controller.deleteUser(req.user).then((response) => {
    res.json(response);
  });
});

// ------------------------PROFILE ABOVE-------------------------------

module.exports = router;
