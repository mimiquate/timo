import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    this.store.unloadAll();
    this.session.logOut(this.session.currentUser);
    this.session.setCurrentUser(null);
    this.transitionTo('/');
  }
});