import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TimezoneListComponent extends Component {
  @tracked hover;

  @action
  onHover(e) {
    this.hover = e;
  }

  @action
  mouseLeave() {
    this.hover = null;
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
