import Component from '@glimmer/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default class TimezoneComponent extends Component {
  @computed('args.timezone.members.[]')
  get location() {
    const timezone = this.args.timezone.timezoneName;

    let ret = "";
    timezone.split("/").forEach(t => {
      ret += `${t}, `;
    });
    ret = ret.substring(0, ret.length - 2)

    if (this.args.timezone.members[0].id === "current") {
      ret += " (you)";
    }

    return ret;
  }

  @computed('args.{timezone.members.[],selectedTime}')
  get memberDate() {
    const timezone = this.args.timezone.timezoneName;
    const selectedTime = this.args.selectedTime.format('YYYY-MM-DDTHH:mm:ssZ');
    const formatedDate = moment.tz(selectedTime, timezone);
    const format = "dddd, DD MMMM YYYY, HH:mm";

    return formatedDate.format(format);
  }

  @computed('args.timezone.members.[]')
  get amountOfMembersMessage() {
    const membersLength = this.args.timezone.members.length;

    return membersLength > 1 ? `${membersLength} members` : `${membersLength} member`;
  }
}
