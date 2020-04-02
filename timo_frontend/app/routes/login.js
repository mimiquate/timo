import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (this.currentUser.user) {
      this.transitionTo('landing');
    }
  },

  resetController(controller) {
    controller.setProperties({
      username: '',
      password: ''
    });
  }
});