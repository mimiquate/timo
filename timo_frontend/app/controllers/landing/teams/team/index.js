import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';
import { set } from "@ember/object";
import { compareMemberTimeZones, hoursLeftOver, filterClass, createMemberArray } from 'timo-frontend/utils/table-functions';

export default Controller.extend({
  membersArray: computed('model.members.{[],@each.id}', 'showCurrent', function () {
    const timezoneNow = moment.tz.guess(true);
    const membersToArray = createMemberArray(this.model.members, this.showCurrent, timezoneNow);
    return membersToArray.sort(compareMemberTimeZones);
  }),

  columns: computed('membersArray', function () {
    const memberCol = [];

    const timezoneNow = moment.tz.guess(true);

    this.membersArray.forEach(m => {
      memberCol.pushObject({
        name: m.name,
        timezone: m.timezone,
        valuePath: m.id,
        textAlign: 'center',
        width: 225,
        isCurrent: timezoneNow == m.timezone
      })
    });

    return memberCol;
  }),

  rows: computed('membersArray', function () {
    const memberRows = [];
    let row = {};

    const hours = hoursLeftOver(this.membersArray, new Date());
    const hoursStart = hours[0];
    const hoursEnd = 24 + hours[1];

    const momentNow = moment();
    const hoursTime = momentNow.hours();
    let time = momentNow.minute(0);
    time.hour(0);
    time.subtract(hoursStart, 'hour');

    for (let i = 0; i < hoursEnd; i++) {
      row = {filter: filterClass(i, hoursStart, hoursTime)};

      this.membersArray.forEach(m => {
        row[m.id] = moment.tz(time, m.timezone);
      });

      memberRows.pushObject(row);
      time.add(1, 'hour');
    }

    return memberRows;
  }),

  actions: {
    newMember() {
      set(this, 'newMemberModal', true);
    },

    closeNewMemberModal() {
      set(this, 'newMemberModal', false);
    },

    setValue(value) {
      set(this, 'showCurrent', value);
    },

    async saveMember(memberName, memberTimeZone) {
      await this.store.createRecord('member', {
        name: memberName,
        timezone: memberTimeZone,
        team: this.model
      }).save().then(() => set(this, 'newMemberModal', false));
    }
  }
});