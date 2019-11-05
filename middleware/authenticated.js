export default function({ store, redirect, req }) {
  if (process.server) {
    const isAuthenticated = req.isAuthenticated();
    store.commit('login/updateLogin', isAuthenticated);
    store.commit(
      'profile/updateUsername',
      isAuthenticated ? req.user.data.username : 'Guest'
    );
    store.commit(
      'profile/updateUsername',
      isAuthenticated ? req.user.data.username : '/defaultProfilePic.png'
    );
    if (!store.state.login.isAuthenticated) {
      redirect('/login');
    } else {
      store.commit('profile/updateEmail', req.user.data.email);
      if (req.user.type === 'google') {
        store.commit('profile/updateOAuth', true);
        store.commit('profile/updateAvatarURL', req.user.data.avatar);
      } else if (req.user.type === 'local') {
        store.commit('profile/updateOAuth', false);
      }
    }
  }
}
