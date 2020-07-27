import Controller from '@ember/controller';
import { set, action } from '@ember/object';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default class LandingTeamsNewController extends Controller {
  constructor() {
    super(...arguments);
    set(this, 'emptyInputValidation', emptyInput);
  }

  @action
  async saveTeam() {
    let { teamName } = this;
    let newTeamName = teamName.trim();

    set(this, 'teamName', newTeamName);

    let team = this.store.createRecord('team', {
      name: newTeamName,
      user: this.currentUser.user
    });

    await team.save();
    await this.transitionToRoute('landing.teams.team', team);
  }
}
