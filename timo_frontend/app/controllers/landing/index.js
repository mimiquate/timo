import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import {  action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LandingIndexController extends Controller {
  @service session;
  @tracked showNewTeamModal = false;

  @action
  openTeamModal() {
    this.showNewTeamModal = true;
  }

  @action
  closeNewTeamModal() {
    this.showNewTeamModal = false;
  }


  @action
  async saveTeam(newTeamName) {
    let team = this.store.createRecord('team', {
      name: newTeamName.trim(),
      user: this.currentUser.user
    });

    await team.save();
    this.closeNewTeamModal();
    await this.transitionToRoute('landing.teams.team', team);

    const teamList = document.getElementsByClassName('sidenavbar__content').item(0);
    teamList.scrollTop = teamList.scrollHeight;
  }
}
