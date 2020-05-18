import EmberTable from 'ember-table/components/ember-table/component';
import { later } from '@ember/runloop';
import { set } from "@ember/object";

export default EmberTable.extend({
  didRender() {
    this._super(...arguments);

    if (!this.didScroll) {
      later(() => {
        const table = document.getElementById('scroll-target');
        const tableMiddle = (table.offsetHeight / 2) - 56;
        const scrollTargetAmount = (48 * this.currentRowNumber) - tableMiddle;

        table.scrollTop = scrollTargetAmount;
        set(this, 'didScroll', true);
      }, 500);
    }
  },
});