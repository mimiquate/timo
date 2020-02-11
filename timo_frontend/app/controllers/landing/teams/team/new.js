import Controller from '@ember/controller';
import { set } from "@ember/object";
import moment from 'moment';

export default Controller.extend({
  timezoneList: moment.tz.names(),

  actions: {
    async saveMember() {
      let { memberName } = this;
      let newMemberName = memberName.trim();
      let { memberTimeZone } = this;

      set(this, 'memberName', newMemberName);

      if (newMemberName && memberTimeZone) {
        let member = this.store.createRecord('member', {
          name: newMemberName,
          timezone: memberTimeZone,
          team: this.model
        });

        await member.save();
        await this.transitionToRoute('landing.teams.team', this.model);
      }
    },

    setValue(value) {
      set(this, 'memberName', value);
    },

    setSelectedValue(value) {
      set(this, 'memberTimeZone', value);
    }
  }
});
