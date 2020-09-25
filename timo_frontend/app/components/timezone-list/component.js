import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { smoothScrollLeft, getEndPosition } from 'timo-frontend/utils/timo-animations';
import { later } from '@ember/runloop';

export default class TimezoneListComponent extends Component {
  @tracked previousAnimationId = null;
  @tracked isShowingCalendarPopover = false;

  @action
  selectBoxWithScroll(index, time) {
    this.args.selectBox(index, time);

    later(() => {
      this.scrollToSelected(index);
    }, 200);
  }

  @action
  scrollAll(event) {
    if (this.previousAnimationId) cancelAnimationFrame(this.previousAnimationId);

    const scrollAmount = event.target.scrollLeft;
    const timezoneDivs = Array.from(document.getElementsByClassName('timezone-list__time-zone'));

    timezoneDivs.forEach(element => {
      if (element != event.target) {
        element.scrollLeft = scrollAmount;
      }
    });
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

  @action
  toggleCalendarPopoverBackground(value) {
    this.isShowingCalendarPopover = value;
  }
}
