export default function({ store, redirect, req }) {
  if (process.server) {
    const isAuthenticated = req.isAuthenticated();
    store.commit('login/updateLogin', isAuthenticated);
    if (!isAuthenticated) {
      redirect('/login');
    } else {
      store.commit('profile/updateEmail', req.user.data.email);
      store.commit('profile/updateDisplayName', req.user.data.displayName);
      store.commit('profile/updateAvatarURL', req.user.data.avatar);
      if (req.user.type === 'google') {
        store.commit('profile/updateOAuth', true);
      } else if (req.user.type === 'local') {
        store.commit('profile/updateUsername', req.user.data.username);
        store.commit('profile/updateOAuth', false);
      }
    }
  }
}
