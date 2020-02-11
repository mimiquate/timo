import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (!this.session.currentUser) {
      this.transitionTo('login');
    }
  },

  model() {
    return this.store.findAll('team')
  }
});