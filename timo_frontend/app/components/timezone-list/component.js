import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { smoothScrollLeft, getEndPosition } from 'timo-frontend/utils/timo-animations';
import { later } from '@ember/runloop';
import moment from 'moment';

export default class TimezoneListComponent extends Component {
  @tracked previousAnimationId = null;

  @action
  selectBoxWithScroll(index, time) {
    this.args.selectBox(index, time);

    later(() => {
      this.scrollToSelected(index);
    }, 200);
  }

  scrollToSelected(index) {
    const boxWidth = document.getElementsByClassName('timezone-list__hour').item(0).offsetWidth;
    const timezoneDivs = Array.from(document.getElementsByClassName('timezone-list__time-zone'));
    const firstTimezoneDiv = timezoneDivs[0];

    const startPosition = firstTimezoneDiv.scrollLeft;
    const endPosition = getEndPosition(firstTimezoneDiv, boxWidth, index);
    const distance = endPosition - startPosition;

    if (distance != 0) {
      this.previousAnimationId = smoothScrollLeft(timezoneDivs, startPosition, distance, 500, this.previousAnimationId);
    }
  }

  get showGroupTimezonesCheckbox() {
    const timeNow = moment.utc();

    const timezonesName = this.args.members.map(m => m.timezone);
    const offsets = this.args.members.map(m => {
      return moment.tz.zone(m.timezone).utcOffset(timeNow);
    });

    return new Set(offsets).size !== new Set(timezonesName).size;
  }
}
