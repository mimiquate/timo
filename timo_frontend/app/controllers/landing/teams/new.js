import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default class LandingTeamsNewController extends Controller {
  @tracked teamName = '';
  emptyInputValidation = emptyInput;

  @action
  async saveTeam() {
    let { teamName } = this;
    let newTeamName = teamName.trim();

    this.teamName = newTeamName;

    let team = this.store.createRecord('team', {
      name: newTeamName,
      user: this.currentUser.user
    });

    await team.save();
    await this.transitionToRoute('landing.teams.team', team);
  }
}
