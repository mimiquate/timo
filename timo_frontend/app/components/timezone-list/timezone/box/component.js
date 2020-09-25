import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BoxComponent extends Component {
  @tracked showCalendarPopover = false;

  @action
  tooltipAction() {
    this.args.scheduleEvent(this.args.time.value);
    this.args.toggleCalendarPopoverBackground(false);
    this.showCalendarPopover = false;
  }

  @action
  handleAction() {
    if (this.args.selected) {
      this.openCalendarPopover();
    } else {
      const { index, time } = this.args;

      this.args.selectBox(index, time.value);
    }
  }

  @action
  openCalendarPopover() {
    this.args.toggleCalendarPopoverBackground(true);
    this.showCalendarPopover = true;
  }

  @action
  closeCalendarPopover() {
    this.args.toggleCalendarPopoverBackground(false);
    this.showCalendarPopover = false;
  }
}
