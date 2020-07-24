import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, set, action } from '@ember/object';

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

export default Controller.extend({
  session: service(),
  router: service(),

  currentTeamId: computed('router.currentURL', function () {
    return this.router.currentRoute.attributes.id;
  }),

  sortedTeams: computed('model.[]', function () {
    const teamsToArray = this.model.toArray();

    return teamsToArray.sort(compareTeamsByCreationTime);
  }),

  @action
  async addOne() {
    await this.transitionToRoute('landing.teams.new');
  },

  @action
  async logOut() {
    this.session.invalidate();
    await this.currentUser.logOut();
    this.store.unloadAll();
    this.transitionToRoute('/login');
  },

  @action
  deleteTeamModal(team) {
    set(this, 'showDeleteTeamModal', true);
    set(this, 'teamToDelete', team);
  },

  @action
  closeDeleteTeamModal() {
    set(this, 'showDeleteTeamModal', false);
  },

  @action
  async deleteTeam() {
    if (this.teamToDelete) {
      await this.teamToDelete.destroyRecord();
      set(this, 'showDeleteTeamModal', false);

      if (this.currentTeamId === this.teamToDelete.id) {
        await this.transitionToRoute('landing');
      }
    }
  },

  @action
  async goToTeam(team) {
    await this.transitionToRoute('landing.teams.team', team.id);
  }
});