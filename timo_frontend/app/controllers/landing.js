import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    async addOne() {
      await this.transitionToRoute('landing.teams.new');
    },

    async logOut() {
      this.session.setCurrentUser(null);
      await this.transitionToRoute('login');
    }
  }
});