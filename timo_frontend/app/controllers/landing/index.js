import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LandingIndexController extends Controller {
  @service session;
  @service media;
  @service router;
  @service currentUser;

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

    this.router.transitionTo('landing.teams.team', team.id);

    if (!this.media.isMobile) {
      const teamList = document.getElementsByClassName('sidenavbar__content').item(0);
      teamList.scrollTop = teamList.scrollHeight;
    }
  }

  @action
  async logOut() {
    this.session.invalidate();
    await this.currentUser.logOut();
    this.store.unloadAll();
    this.router.transitionTo('/login');
  }
}
