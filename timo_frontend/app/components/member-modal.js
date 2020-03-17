import Component from '@ember/component';
import moment from 'moment';
import { set } from "@ember/object";

export default Component.extend({
  init() {
    this._super(...arguments);
    if (this.memberColumn) {
      set(this, 'memberName', this.memberColumn.name);
      set(this, 'memberTimeZone', this.memberColumn.timezone);
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
