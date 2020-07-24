import Component from '@ember/component';
import moment from 'moment';
import { set, action } from '@ember/object';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default Component.extend({
  init() {
    this._super(...arguments);
    if (this.member) {
      set(this, 'memberName', this.member.name);
      set(this, 'memberTimeZone', this.member.timezone);
    }
    set(this, 'emptyInputValidation', emptyInput);
  },

  timezoneList: moment.tz.names(),

  @action
  add() {
    const memberName = this.memberName.trim();
    const memberTimeZone = this.memberTimeZone;

    this.addMember(memberName, memberTimeZone);
  }
});
