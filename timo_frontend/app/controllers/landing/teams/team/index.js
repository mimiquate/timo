import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';

function compareTimeZones(memberA, memberB) {
  const aTime = moment.tz(memberA.timezone).format();
  const bTime = moment.tz(memberB.timezone).format();

  if (aTime < bTime) {
    return -1;
  }

  if (aTime > bTime) {
    return 1;
  }

  return 0;
}

function hoursLeftOver(membersArray) {
  const length = membersArray.length;

  const now = moment.utc();
  const timeNow = new Date().getTimezoneOffset();

  const earlyTZ = membersArray[length - 1].timezone;
  const earlyTime = moment.tz.zone(earlyTZ).utcOffset(now);
  const hoursStart = (earlyTime - timeNow) / 60;

  const lateTz = membersArray[0].timezone;
  const lateTime = moment.tz.zone(lateTz).utcOffset(now);
  const hoursLeft = (lateTime - earlyTime) / 60;

  return [hoursStart, hoursLeft];
}

export default Controller.extend({
  membersArray: computed('model.members', function () {
    return this.model.members.toArray().sort(compareTimeZones);
  }),

  columns: computed('membersArray', function () {
    const memberCol = [];

    this.membersArray.forEach(m => {
      memberCol.pushObject({
        name: `${m.name} (${m.timezone})`,
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

    const hours = hoursLeftOver(this.membersArray);
    const hoursStart = hours[0];
    const hoursLeft = 24 + hours[1];
  
    let time = moment().minute(0);
    time.hour(0);
    time.subtract(hoursStart, 'hour');

    for (let i = 0; i < hoursLeft; i++) {
      row = {};

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
    }
  }
});