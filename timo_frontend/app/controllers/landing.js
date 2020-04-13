import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  actions: {
    async addOne() {
      await this.transitionToRoute('landing.teams.new');
    },

    async logOut() {
      this.session.invalidate();
      await this.currentUser.logOut();
      this.store.unloadAll();
      this.transitionToRoute('/login');
    }
  }
});