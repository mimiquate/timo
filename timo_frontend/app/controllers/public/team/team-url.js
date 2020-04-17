import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';
import { compareMemberTimeZones, hoursLeftOver, filterClass, createMemberArray } from 'timo-frontend/utils/table-functions';

export default Controller.extend({
  sortedMembers: computed('showCurrent', function () {
    const timezoneNow = moment.tz.guess(true);
    const membersToArray = createMemberArray(this.model.members, this.showCurrent, timezoneNow);

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
      row = { filter: filterClass(i, hoursStart, hoursTime) };

      this.sortedMembers.forEach(m => {
        row[m.id] = moment.tz(time, m.timezone);
      });

      memberRows.pushObject(row);
      time.add(1, 'hour');
    }

    return memberRows;
  })
});