import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

function compareTeamsByCreationTime(teamA, teamB) {
  const aCreationTime = teamA.inserted_at;
  const bCreationTime = teamB.inserted_at;

  let ret = 0
  if (aCreationTime < bCreationTime) {
    ret = -1;
  } else if (aCreationTime > bCreationTime) {
    ret = 1;
  }

  return ret;
}

export default class LandingController extends Controller {
  @service session;
  @service router;
  @service media;

  @tracked showToggleablePopover = false;
  @tracked showNewTeamModal = false;
  @tracked isOpenSideNavBar = false;

  @computed('router.currentURL')
  get currentTeamId() {
    return this.router.currentRoute.attributes.team.id;
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
    await this.transitionToRoute('landing.teams.team', team);

    const teamList = document.getElementsByClassName('sidenavbar__content').item(0);
    teamList.scrollTop = teamList.scrollHeight;
  }
}
