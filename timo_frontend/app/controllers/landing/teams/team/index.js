import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';
import { set } from "@ember/object";
import { compareMemberTimeZones, hoursLeftOver, filterClass, createMemberArray } from 'timo-frontend/utils/table-functions';

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
    const memberCol = [];

    const timezoneNow = moment.tz.guess(true);

    this.sortedMembers.forEach(m => {
      memberCol.pushObject({
        member: m,
        valuePath: m.id,
        textAlign: 'center',
        width: 225,
        isCurrent: timezoneNow === m.timezone
      })
    });

    return memberCol;
  }),

  rows: computed('sortedMembers.[]', function () {
    const memberRows = [];
    let row = {};

    const hours = hoursLeftOver(this.sortedMembers, new Date());
    const hoursStart = hours[0];
    const hoursEnd = 24 + hours[1];

    const momentNow = moment();
    const hoursTime = momentNow.hours();
    let time = momentNow.minute(0);
    time.hour(0);
    time.subtract(hoursStart, 'hour');

    for (let i = 0; i < hoursEnd; i++) {
      row = {filter: filterClass(i, hoursStart, hoursTime)};

      this.sortedMembers.forEach(m => {
        row[m.id] = moment.tz(time, m.timezone);
      });

      memberRows.pushObject(row);
      time.add(1, 'hour');
    }

    return memberRows;
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