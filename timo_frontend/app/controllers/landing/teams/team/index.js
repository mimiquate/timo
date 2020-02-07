import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';

export default Controller.extend({
  columns: computed('model.members', function() {
    let memberCol = [];

    this.model.members.toArray().forEach(m => {
      memberCol.push({name: `${m.name} (${m.timezone})`, valuePath: m.id, width: 200})
    });

    return memberCol;
  }),

  rows: computed('model.members', function() {
    let memberRows = [];
    let cell = {};
    let time = moment().minute(0);
    let hoursLeft = 24 - time.hours();

    for (let i = 0; i < hoursLeft; i++) {
      cell = {};

      this.model.members.toArray().forEach(m => {
        cell[m.id] = moment.tz(time, m.timezone).format("d MMM YYYY - HH:mm");
      });

      memberRows.push(cell);
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