const bcrypt = require('bcrypt');
require('dotenv').config();
// const Cryptr = require('cryptr');
// const cryptr = new Cryptr(process.env.SECRET_ENCRYPTION_KEY); // not in use
const User = require('../models/user');

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
    const user = await User.findOne(
      {
        type: 'local',
        'data.username': username
      }
      // function(user, error) {
      //   if (error) {
      //     return { valid: false, errMessage: error }
      //   }
      //   if (!user) {
      //     return { valid: false, errMmessage: 'Incorrect username.' }
      //   }
      // }
    );
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
          passwordHash: bcrypt.hashSync(password, 10)
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

exports.updateEmail = async function(username, email) {
  username = username.toLowerCase().trim();
  email = email.trim();
  if (email) {
    const user = await User.findOneAndUpdate(
      { type: 'local', 'data.username': username },
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
