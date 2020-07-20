import Component from '@ember/component';
import moment from 'moment';
import { set } from "@ember/object";
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

  actions: {
    add() {
      const memberName = this.memberName.trim();
      const memberTimeZone = this.memberTimeZone;

      this.addMember(memberName, memberTimeZone);
    },

    deleteMemberModal() {
      set(this, 'showDeleteMemberModal', true);
    },

    closeDeleteMemberModal() {
      set(this, 'showDeleteMemberModal', false);
    },

    async deleteMember() {
      if (this.member) {
        set(this, 'showDeleteTeamModal', false);
        this.closeModal.call()

        await this.member.destroyRecord();
      }
    }
  }
});
