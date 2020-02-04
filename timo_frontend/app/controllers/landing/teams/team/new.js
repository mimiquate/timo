import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from "@ember/object";

export default Controller.extend({
  session: service(),

  actions: {
    async saveMember() {
      let { memberName } = this;
      let newMemberName = memberName.trim();
      let { timezone } = this;

      set(this, 'memberName', newMemberName);

      if (newMemberName) {
        let member = this.store.createRecord('member', {
          name: newMemberName,
          timezone: timezone,
          team: this.model
        });

        await member.save();
        await this.transitionToRoute('landing.teams.team', this.model);
      }
    },

    setValue(value) {
      set(this, 'memberName', value);
    }
  }
});
