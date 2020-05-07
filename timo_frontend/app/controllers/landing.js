import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from "@ember/object";

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
    }
  }
});