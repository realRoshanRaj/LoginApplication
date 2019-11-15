export const state = () => ({
  username: 'guest',
  displayName: 'Guest',
  email: '',
  oauth: false,
  avatarURL: '/defaultProfilePic.png'
});

export const mutations = {
  updateUsername(state, username) {
    state.username = username;
  },
  updateDisplayName(state, name) {
    state.displayName = name;
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
