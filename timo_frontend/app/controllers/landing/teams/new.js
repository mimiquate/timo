import Controller from '@ember/controller';
import { set } from "@ember/object";
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default Controller.extend({
  init() {
    this._super(...arguments);
    set(this, 'emptyInputValidation', emptyInput);
  },

  actions: {
    async saveTeam() {
      let { teamName } = this;
      let newTeamName = teamName.trim();

      set(this, 'teamName', newTeamName);

      let team = this.store.createRecord('team', {
        name: newTeamName,
        user: this.currentUser.user,
        public: false
      });

      await team.save();
      await this.transitionToRoute('landing.teams.team', team);
    }
  }
});
