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

export default class LandiingController extends Controller {
  @service session;
  @service router;

  @tracked showDeleteTeamModal = false;
  @tracked teamToDelete = null;
  @tracked showToggleablePopover = false;

  @computed('router.currentURL')
  get currentTeamId() {
    return this.router.currentRoute.attributes.id;
  }

  @computed('model.[]')
  get sortedTeams() {
    const teamsToArray = this.model.toArray();

    return teamsToArray.sort(compareTeamsByCreationTime);
  }

  @action
  async addOne() {
    await this.transitionToRoute('landing.teams.new');
  }

  @action
  async logOut() {
    this.session.invalidate();
    await this.currentUser.logOut();
    this.store.unloadAll();
    this.transitionToRoute('/login');
  }

  @action
  deleteTeamModal(team) {
    this.showDeleteTeamModal = true;
    this.teamToDelete = team;
  }

  @action
  closeDeleteTeamModal() {
    this.showDeleteTeamModal = false;
  }

  @action
  async deleteTeam() {
    if (this.teamToDelete) {
      await this.teamToDelete.destroyRecord();
      this.showDeleteTeamModal = false;

      if (this.currentTeamId === this.teamToDelete.id) {
        await this.transitionToRoute('landing');
      }
    }
  }

  @action
  async goToTeam(team) {
    await this.transitionToRoute('landing.teams.team', team.id);
  }

  @action
  togglePopover() {
    this.showToggleablePopover = !this.showToggleablePopover;
  }
}
