import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    async newMember() {
      await this.transitionToRoute('landing.teams.team.new', this.model);
    }
  }
});