import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';
import { smoothScrollLeft, getEndPosition } from 'timo-frontend/utils/timo-animations';
import { later } from '@ember/runloop';

export default class TimezoneListComponent extends Component {
  @tracked selectedBoxIndex = this.args.currentIndex;
  @tracked selectedTime = moment();
  @tracked previousAnimationId = null;

  @action
  selectBox(index, time) {
    this.selectedBoxIndex = index;
    this.selectedTime = time;

    later(() => {
      this.scrollToSelected(index);
    }, 250);
  }

  @action
  scrollAll(event) {
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
    const firstTimezoneDiv = document.getElementsByClassName('timezone-list__time-zone').item(0);

    const startPosition = firstTimezoneDiv.scrollLeft;
    const endPosition = getEndPosition(firstTimezoneDiv, boxWidth, index);
    const distance = endPosition - startPosition;

    if (distance != 0) {
      this.previousAnimationId = smoothScrollLeft(firstTimezoneDiv, startPosition, distance, 500, this.previousAnimationId);
    }
  }
}
