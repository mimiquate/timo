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

export default class MembersTableComponent extends EmberTable {
  didInsertElement() {
    super.didInsertElement(...arguments);

    later(() => {
      scrollMembersTable(this.currentRowIndex);
    }, 500);
  }

  didUpdateAttrs() {
    super.didUpdateAttrs(...arguments);

    later(() => {
      scrollMembersTable(this.currentRowIndex);
    }, 500);
  }
}