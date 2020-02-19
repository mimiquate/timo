import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';
import { set } from "@ember/object";
import { compareTimeZones, hoursLeftOver, filterClass } from 'timo-frontend/utils/table-functions'

function createMemberArray(modelMembers, showCurrent) {
  const returnArray = modelMembers.toArray();

  const timezoneNow = moment.tz.guess(true);
  if (showCurrent) {
    const hasCurrent = returnArray.some(m => {
      return m.timezone == timezoneNow;
    });
    if (!hasCurrent) {
      returnArray.pushObject({
        name: 'Your current timezone',
        timezone: timezoneNow,
        id: 'current'
      });
    }
  }

  return returnArray;
}

export default Controller.extend({
  membersArray: computed('model.members', 'showCurrent', function () {
    const membersToArray = createMemberArray(this.model.members, this.showCurrent);
    return membersToArray.sort(compareTimeZones);
  }),

  columns: computed('membersArray', function () {
    const memberCol = [];

    this.membersArray.forEach(m => {
      memberCol.pushObject({
        name: m.name,
        timezone: m.timezone,
        valuePath: m.id,
        textAlign: 'center',
        width: 225
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
    async newMember() {
      await this.transitionToRoute('landing.teams.team.new', this.model);
    },

    setValue(value) {
      set(this, 'showCurrent', value);
    }
  }
});