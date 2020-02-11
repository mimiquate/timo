import Controller from '@ember/controller';
import { set } from "@ember/object";
import { isPresent } from '@ember/utils';

export default Controller.extend({
  actions: {
    async saveTeam() {
      let { teamName } = this;
      let newTeamName = teamName.trim();
      const currentUser = this.session.currentUser;

      set(this, 'teamName', newTeamName);

      if (isPresent(newTeamName)) {
        let team = this.store.createRecord('team', {
          name: newTeamName,
          user: currentUser
        });

        await team.save();
        await this.transitionToRoute('landing.teams.team', team);
      }
    },

    setValue(value) {
      set(this, 'teamName', value);
    }
  }
});
