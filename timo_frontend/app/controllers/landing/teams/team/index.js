import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';
import { set } from "@ember/object";
import { compareMemberTimeZones, createMemberArray } from 'timo-frontend/utils/table-functions';
import { columnsMember, rowsMember } from 'timo-frontend/utils/member-column-rows';

export default Controller.extend({
  savedMembers: computed('model.members.{[],@each.id}', function () {
    return this.model.members.filterBy('id');
  }),

  sortedMembers: computed('savedMembers.{[],@each.name,@each.timezone}', 'showCurrent', function () {
    const timezoneNow = moment.tz.guess(true);
    const membersToArray = createMemberArray(this.savedMembers, this.showCurrent, timezoneNow);

    return membersToArray.sort(compareMemberTimeZones);
  }),

  columns: computed('sortedMembers.[]', function () {
    return columnsMember(this.sortedMembers);
  }),

  rows: computed('sortedMembers.[]', function () {
    return rowsMember(this.sortedMembers);
  }),

  actions: {
    closeMemberModal(modal) {
      set(this, modal, false);
    },

    newMember() {
      set(this, 'newMemberModal', true);
    },

    async saveMember(memberName, memberTimeZone) {
      await this.store.createRecord('member', {
        name: memberName,
        timezone: memberTimeZone,
        team: this.model
      }).save().then(() => set(this, 'newMemberModal', false));
    },

    editMember(member) {
      set(this, 'memberToEdit', member);
      set(this, 'editMemberModal', true);
    },

    async saveEditMember(memberName, memberTimeZone) {
      if (!(memberName === this.memberToEdit.name
        && memberTimeZone === this.memberToEdit.timezone))
      {
        set(this.memberToEdit, 'name', memberName);
        set(this.memberToEdit, 'timezone', memberTimeZone);

        this.memberToEdit.save();
      }

      set(this, 'editMemberModal', false);
    }
  }
});