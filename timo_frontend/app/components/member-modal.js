import Component from '@ember/component';
import moment from 'moment';
import { set } from "@ember/object";

export default Component.extend({
  init() {
    this._super(...arguments);
    if (this.member) {
      set(this, 'memberName', this.member.name);
      set(this, 'memberTimeZone', this.member.timezone);
    }
  },

  timezoneList: moment.tz.names(),

  actions: {
    add() {
      const memberName = this.memberName.trim();
      const memberTimeZone = this.memberTimeZone;

      if (memberName && memberTimeZone) {
        this.addMember(memberName, memberTimeZone);
      }
    }
  }
});
