const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/profile');

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

router.post('/updateDisplayName', function(req, res) {
  controller
    .updateDisplayName(req.user._id, req.body.displayName)
    .then((response) => {
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

router.post('/updateAvatarURL', function(req, res) {
  controller
    .updateAvatarURL(req.user._id, req.body.avatarURL)
    .then((response) => {
      res.json(response);
    });
});

router.post('/updateAvatarFile', function(req, res) {
  controller.updateAvatarFile(req.files.image).then((response) => {
    controller.updateAvatarURL(req.user._id, response.url).then((foo) => {
      res.json(foo);
    });
  });
});

// ------------------------PROFILE ABOVE-------------------------------

module.exports = router;
