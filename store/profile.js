export const state = () => ({
  username: 'Guest',
  email: '',
  oauth: false,
  avatarURL: '/defaultProfilePic.png'
});

export const mutations = {
  updateUsername(state, username) {
    state.username = username;
  },
  updateEmail(state, email) {
    state.email = email;
  },
  updateOAuth(state, oauth) {
    state.oauth = oauth;
  },
  updateAvatarURL(state, value) {
    state.avatarURL = value;
  }
};
