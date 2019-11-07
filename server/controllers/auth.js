const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const User = require('../models/user');

// Google Stategy
exports.googleAuth = async function(profile) {
  // check if User Already exits
  let user = await User.findOne({ type: 'google', 'data.id': profile.id });
  if (user) return { user };
  // create db entry if user doesn't exist
  const json = profile._json;
  user = new User({
    type: 'google',
    data: {
      id: json.sub,
      username: json.name,
      email: json.email,
      avatar: json.picture
    }
  });
  const savedUser = await user.save();
  return { user: savedUser };
};

// Local Strategy
exports.username_unique = async function(username) {
  username = username.trim().toLowerCase();
  if (!username) {
    return false;
  }

  const search = await User.findOne({
    type: 'local',
    'data.username': username
  });

  if (search === null) {
    return true;
  }
  return false;
};

exports.validateUser = async function(username, password) {
  if (username && password) {
    const user = await User.findOne({
      type: 'local',
      'data.username': username
    });
    if (!user) {
      return { valid: false, errMmessage: 'Incorrect username.' };
    }

    if (!bcrypt.compareSync(password, user.data.passwordHash)) {
      return { valid: false, errMessage: 'Incorrect password.' };
    }

    return { valid: true, userData: user };
  }
};

exports.register = async function(username, email, password) {
  username = username.trim().toLowerCase();
  email = email.trim();
  if (username && email && password) {
    const isUsernameUnique = await this.username_unique(username);
    if (isUsernameUnique) {
      const newUser = new User({
        type: 'local',
        data: {
          username,
          email,
          passwordHash: bcrypt.hashSync(password, 10),
          avatar: '/defaultProfilePic.png'
        }
      });

      const savedUser = await newUser.save();
      return { valid: true, user: savedUser };
    } else {
      // username not unique
      return { valid: false };
    }
  } else {
    // all fields were not filled
    return { valid: false };
  }
};

exports.passwordReset = function(email) {
  const msg = {
    to: email,
    from: 'test@example.com',
    subject: 'Password Reset for Nuxt Authentication',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  };
  sgMail.send(msg);
};
