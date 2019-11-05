export default function({ store, redirect, req }) {
  if (process.server) {
    const isAuthenticated = req.isAuthenticated();
    store.commit('login/updateLogin', isAuthenticated);
    store.commit(
      'profile/updateUsername',
      isAuthenticated ? req.user.data.username : 'Guest'
    );
    store.commit(
      'profile/updateAvatarURL',
      isAuthenticated ? req.user.data.avatar : '/defaultProfilePic.png'
    );
    if (store.state.login.isAuthenticated) {
      redirect('/');
    }
  }
}
