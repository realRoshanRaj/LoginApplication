const bcrypt = require('bcrypt');
const isImageUrl = require('is-image-url');
const cloudinary = require('cloudinary').v2;
const User = require('../models/user');

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

exports.updateDisplayName = async function(id, displayName) {
  displayName = displayName.trim();
  if (displayName) {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { 'data.displayName': displayName }
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

exports.getEmail = function(encryptedEmail) {
  // return cryptr.decrypt(encryptedEmail);
  return { encryptedEmail };
};

exports.updateAvatarFile = async function(imageData) {
  let url = '/defaultProfilePic.png';
  const imagePath = imageData.tempFilePath;
  await cloudinary.uploader.upload(imagePath, { tags: 'avatar' }, function(
    err,
    image
  ) {
    if (err) {
      console.warn(err);
    }
    url = image.url;
  });
  return { url };
};

exports.updateAvatarURL = async function(id, url) {
  if (!isImageUrl(url))
    return {
      success: false,
      message: 'Please enter a URL that is linked to an image. '
    };
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { 'data.avatar': url }
  );
  const success = !!user;
  return {
    success,
    url: success ? url : '/defaultProfilePic.png',
    message: success ? '' : 'User not found'
  };
};
