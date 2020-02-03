import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from "@ember/object";

export default Controller.extend({
  session: service(),

  actions: {
    async saveTeam() {
      let { teamName } = this;
      let newTeamName = teamName.trim();
      const currentUser = this.session.currentUser;

      set(this, 'teamName', newTeamName);

      if (newTeamName) {
        let team = this.store.createRecord('team', {
          name: newTeamName,
          user: currentUser
        });

        await team.save();
        await this.transitionToRoute('landing.teams.team', team.id);
      }
    },

    setValue(value) {
      set(this, 'teamName', value);
    }
  }
});
