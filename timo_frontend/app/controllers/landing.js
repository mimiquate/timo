import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from "@ember/object";
import { set } from "@ember/object";

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

  sortedTeams: computed('model.[]', function () {
    const teamsToArray = this.model.toArray();

    return teamsToArray.sort(compareTeamsByCreationTime);
  }),

  actions: {
    async addOne() {
      await this.transitionToRoute('landing.teams.new');
    },

    async logOut() {
      this.session.invalidate();
      await this.currentUser.logOut();
      this.store.unloadAll();
      this.transitionToRoute('/login');
    },

    deleteTeamModal(team) {
      set(this, 'showDeleteTeamModal', true);
      set(this, 'teamToDelete', team);
    },

    closeDeleteTeamModal() {
      set(this, 'showDeleteTeamModal', false);
    },

    async deleteTeam() {
      if (this.teamToDelete) {
        await this.teamToDelete.destroyRecord();
        set(this, 'showDeleteTeamModal', false);

        const pathname = this.router.currentURL;
        const deletePath = `/teams/${this.teamToDelete.id}`;
        if (pathname === deletePath) {
          await this.transitionToRoute('landing');
        }
      }
    },

    async goToTeam(team) {
      await this.transitionToRoute('landing.teams.team', team);
    }
  }
});