import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';

export default Controller.extend({
  membersArray: computed('model.members', function () {
    return this.model.members.toArray().sort(function (a, b) {
      const aTime = moment.tz(a.timezone).format();
      const bTime = moment.tz(b.timezone).format();

      if (aTime < bTime) {
        return -1;
      }

      if (aTime > bTime) {
        return 1;
      }

      return 0
    });
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
    let cell = {};
    let time = moment().minute(0);
    const hoursLeft = 24 - time.hours();

    for (let i = 0; i < hoursLeft; i++) {
      cell = {};

      this.membersArray.forEach(m => {
        cell[m.id] = moment.tz(time, m.timezone).format("D MMM YYYY - HH:mm");
      });

      memberRows.pushObject(cell);
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