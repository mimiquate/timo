import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  actions: {
    async newMember() {
      await this.transitionToRoute('landing.teams.team.new', this.model);
    }
  }
});
