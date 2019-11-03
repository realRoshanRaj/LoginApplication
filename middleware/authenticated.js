export default function({ store, redirect, req }) {
  if (process.server) {
    const isAuthenticated = req.isAuthenticated();
    store.commit('login/updateLogin', isAuthenticated);
    store.commit(
      'profile/updateUsername',
      isAuthenticated ? req.user.data.username : 'Guest'
    );
    if (!store.state.login.isAuthenticated) {
      redirect('/login');
    } else {
      store.commit('profile/updateEmail', req.user.data.email);
    }
  }
}
