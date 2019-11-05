const bcrypt = require('bcrypt');
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

exports.getEmail = function(encryptedEmail) {
  // return cryptr.decrypt(encryptedEmail);
  return { encryptedEmail };
};

exports.updateEmail = async function(id, email) {
  email = email.trim();
  if (email) {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { 'data.email': email }
    );
    return { success: true };
  }

  return { success: false };
};

exports.changePassword = async function(user, currentPassword, newPassword) {
  if (user) {
    if (bcrypt.compareSync(currentPassword, user.data.passwordHash)) {
      await User.findOneAndUpdate(
        { type: 'local', 'data.username': user.data.username },
        { 'data.passwordHash': bcrypt.hashSync(newPassword, 10) }
      );
      return {
        message:
          'Password Successfully Changed. You will be directed to the login page.',
        success: true
      };
    } else {
      return { message: 'Current Password Does Not Match', success: false };
    }
  } else {
    return { message: 'User not found', success: false };
  }
};

exports.deleteUser = async function(user) {
  if (user) {
    const id = user._id;
    await User.findByIdAndDelete({ _id: id });
    return { success: true };
  }
};
