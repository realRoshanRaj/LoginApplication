export const state = () => ({
  username: 'Guest',
  email: ''
});

export const mutations = {
  updateUsername(state, username) {
    state.username = username;
  },
  updateEmail(state, email) {
    state.email = email;
  }
};
