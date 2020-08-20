import Component from '@glimmer/component';
import { computed } from '@ember/object';

export default class TimezoneComponent extends Component {
  @computed('timezone.member')
  get country() {
    const timezone = this.args.timezone.member.timezone;

    return timezone.split("/")[0];
  }

  @computed('timezone.member')
  get state() {
    const timezone = this.args.timezone.member.timezone;

    return timezone.split("/")[1];
  }

  @computed('row')
  get memberDate() {
    return 'Test Day';
  }
}
