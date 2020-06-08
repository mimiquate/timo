import EmberTable from 'ember-table/components/ember-table/component';
import { later } from '@ember/runloop';

function scrollMembersTable(currentRowIndex) {
  const table = document.getElementById('scroll-target');
  if (table) {
    const tableMiddle = (table.offsetHeight / 2) - 56;
    const scrollTargetAmount = (48 * currentRowIndex) - tableMiddle;

    table.scrollTop = scrollTargetAmount;
  }
}

export default EmberTable.extend({
  didInsertElement() {
    this._super(...arguments);

    later(() => {
      scrollMembersTable(this.currentRowIndex);
    }, 500);
  },

  didUpdateAttrs() {
    this._super(...arguments);

    later(() => {
      scrollMembersTable(this.currentRowIndex);
    }, 500);
  }
});