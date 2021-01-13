import Component from '@glimmer/component';
import { action } from '@ember/object';
import { smoothScrollLeft, getEndPosition } from 'timo-frontend/utils/timo-animations';
import { later } from '@ember/runloop';
import { addMoreHours } from 'timo-frontend/utils/timezone-functions';
import moment from 'moment';

export default class TimezoneListComponent extends Component {
  scrollToSelected(index) {
    const boxWidth = document.getElementsByClassName('timezone-list__hour').item(0).offsetWidth;
    const timezoneDivs = Array.from(document.getElementsByClassName('timezone-list__time-zone'));
    const firstTimezoneDiv = timezoneDivs[0];

    const startPosition = firstTimezoneDiv.scrollLeft;
    const endPosition = getEndPosition(firstTimezoneDiv, boxWidth, index);
    const distance = endPosition - startPosition;

    if (distance != 0) {
      smoothScrollLeft(timezoneDivs, startPosition, distance, 500);
    }
  }

  get showGroupTimezonesCheckbox() {
    const timeNow = moment.utc();

    const timezonesName = this.args.members.map(m => m.city.timezone);
    const offsets = this.args.members.map(m => {
      return moment.tz.zone(m.city.timezone).utcOffset(timeNow);
    });

    return new Set(offsets).size !== new Set(timezonesName).size;
  }

  @action
  selectBoxWithScroll(index, time) {
    const previousIndex = this.args.selectedBoxIndex;
    this.args.selectBox(index, time);

    if (index > previousIndex) {
      addMoreHours(index - previousIndex, index, this.args.timezones, this.args.currentIndex);
    }

    later(() => {
      this.scrollToSelected(index);
    }, 200);
  }
}
