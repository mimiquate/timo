import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    async addOne() {
      await this.transitionToRoute('landing.teams.new');
    },

    async logOut() {
      await this.currentUser.logOut();
      this.store.unloadAll();
      this.transitionToRoute('/login');
    }
  }
});