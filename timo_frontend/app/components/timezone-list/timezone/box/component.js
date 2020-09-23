import Component from '@glimmer/component';
import { computed, action } from '@ember/object';
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
