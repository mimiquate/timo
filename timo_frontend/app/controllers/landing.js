import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { compareTeamsByCreationTime } from 'timo-frontend/utils/timezone-functions';

export default class LandingController extends Controller {
  @service session;
  @service router;
  @service media;

  @tracked showToggleablePopover = false;
  @tracked showNewTeamModal = false;

  @computed('router.currentURL')
  get currentTeamId() {
    const team = this.router.currentRoute.attributes.team;

    return isPresent(team) ? team.id : null;
  }

  @computed('model.[]')
  get sortedTeams() {
    const teamsToArray = this.model.toArray();

    return teamsToArray.sort(compareTeamsByCreationTime);
  }

  @action
  openTeamModal() {
    this.showNewTeamModal = true;
  }

  @action
  closeNewTeamModal() {
    this.showNewTeamModal = false;
  }

  @action
  async logOut() {
    this.session.invalidate();
    await this.currentUser.logOut();
    this.store.unloadAll();
    this.togglePopover();
    this.transitionToRoute('/login');
  }

  @action
  async goToTeam(team) {
    await this.transitionToRoute('landing.teams.team', team.id);
  }

  @action
  togglePopover() {
    this.showToggleablePopover = !this.showToggleablePopover;
  }

  @action
  async saveTeam(newTeamName) {
    let team = this.store.createRecord('team', {
      name: newTeamName.trim(),
      user: this.currentUser.user
    });

    await team.save();
    await this.transitionToRoute('landing.teams.team', team.id);

    const teamList = document.getElementsByClassName('sidenavbar__content').item(0);
    teamList.scrollTop = teamList.scrollHeight;
  }
}
