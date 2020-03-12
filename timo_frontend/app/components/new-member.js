import Component from '@ember/component';
import { set } from "@ember/object";
import moment from 'moment';

export default Component.extend({
  timezoneList: moment.tz.names(),

  actions: {
    async add() {
      const memberName  = this.memberName.trim();
      const memberTimeZone = this.memberTimeZone;

      if (memberName && memberTimeZone) {
        this.addMember(memberName, memberTimeZone);
      }
    }
  }
});
