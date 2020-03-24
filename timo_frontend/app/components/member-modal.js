import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  timezoneList: moment.tz.names(),

  actions: {
    add() {
      const memberName  = this.memberName.trim();
      const memberTimeZone = this.memberTimeZone;

      if (memberName && memberTimeZone) {
        this.addMember(memberName, memberTimeZone);
      }
    }
  }
});
