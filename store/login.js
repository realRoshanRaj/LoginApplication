export const state = () => ({
  isAuthenticated: false
});

export const mutations = {
  updateLogin(state, payload) {
    state.isAuthenticated = payload;
  }
};
