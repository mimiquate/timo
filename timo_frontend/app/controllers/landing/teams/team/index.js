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
        width: 220
      })
    });

    return memberCol;
  }),

  rows: computed('membersArray', function () {
    const memberRows = [];
    let row = {};
    let time = moment().minute(0);
    const hoursLeft = 24 - time.hours();

    for (let i = 0; i < hoursLeft; i++) {
      row = {};

      this.membersArray.forEach(m => {
        row[m.id] = moment.tz(time, m.timezone);
      });

      memberRows.pushObject(row);
      time = time.add(1, 'hour');
    }

    return memberRows;
  }),

  actions: {
    async newMember() {
      await this.transitionToRoute('landing.teams.team.new', this.model);
    }
  }
});