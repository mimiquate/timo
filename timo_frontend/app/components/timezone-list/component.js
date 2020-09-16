import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TimezoneListComponent extends Component {
  @tracked selected = this.args.currentIndex;

  @action
  select(i) {
    this.selected = i;
  }

  @action
  scrollAll(event) {
    const scrollAmount = event.target.scrollLeft;
    const timezoneDivs = Array.from(document.getElementsByClassName('timezone-list__time-zone'));

    timezoneDivs.forEach(element => {
      element.scrollLeft = scrollAmount;
    });
  }
}
