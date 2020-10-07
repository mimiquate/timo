import Component from '@glimmer/component';
import { action } from '@ember/object';
import { smoothScrollLeft, getEndPosition } from 'timo-frontend/utils/timo-animations';
import { later } from '@ember/runloop';
import moment from 'moment';
import { cellColor } from 'timo-frontend/utils/timezone-rows';

export default class TimezoneListComponent extends Component {
  @action
  selectBoxWithScroll(index, time) {
    const previousIndex = this.args.selectedBoxIndex;
    this.args.selectBox(index, time);

    if (index > previousIndex) {
      this.addTimesRight(index - previousIndex, index);
    }

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
      smoothScrollLeft(timezoneDivs, startPosition, distance, 500);
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

  addTimesRight(amount, index) {
    const timezones = this.args.timezones;
    const timesLength = timezones[0].times.length;
    const currentIndex = this.args.currentIndex;

    if (timesLength - index < currentIndex) {
      timezones.forEach(timezone => {
        const lastTimeValue = timezone.times[timesLength - 1].value;

        for (let i = 1; i <= amount; i++) {
          const value = lastTimeValue.clone().add(i, 'hour');
          const color = cellColor(value);
          const isCurrentTime = false;

          timezone.times.pushObject({
            value,
            color,
            isCurrentTime
          });
        }
      });
    }
  }
}
