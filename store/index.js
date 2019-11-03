export const actions = {
  nuxtServerInit({ commit }, { req }) {
    const isAuthenticated = req.isAuthenticated();
    commit('login/updateLogin', isAuthenticated);
    commit(
      'profile/updateUsername',
      isAuthenticated ? req.user.data.username : 'Guest'
    );
  }
};
