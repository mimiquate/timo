import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class BoxComponent extends Component {
  @service media;

  @tracked showCalendarPopover = false;

  get tooltipPosition() {
    return this.args.index === 0 ? "left" : "top";
  }

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
