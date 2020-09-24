import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class TimezoneListComponent extends Component {
  @tracked selectedBoxIndex = this.args.currentIndex;
  @tracked selectedTime = moment();

  @action
  selectBox(index, time) {
    this.selectedBoxIndex = index;
    this.selectedTime = time;

    this.scrollToSelected(index);
  }

  @action
  scrollAll(event) {
    const scrollAmount = event.target.scrollLeft;
    const timezoneDivs = Array.from(document.getElementsByClassName('timezone-list__time-zone'));

    timezoneDivs.forEach(element => {
      element.scrollLeft = scrollAmount;
    });
  }

  scrollToSelected(index) {
    const boxWidth = document.getElementsByClassName('timezone-list__hour').item(0).offsetWidth;
    const firstTimezoneDiv = document.getElementsByClassName('timezone-list__time-zone').item(0);

    firstTimezoneDiv.scrollLeft = boxWidth * (index - 12);
  }
}
