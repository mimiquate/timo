import Component from '@glimmer/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default class TimezoneComponent extends Component {
  @computed('timezone.members')
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

  @computed('timezone.members')
  get memberDate() {
    const timezone = this.args.timezone.timezoneName;
    const formatedDate = moment.tz(timezone);
    const format = "dddd, DD MMMM YYYY, HH:mm";

    return formatedDate.format(format);
  }

  @computed('timezone.members.[]')
  get amountOfMembersMessage() {
    const membersLength = this.args.timezone.members.length;

    return membersLength > 1 ? `${membersLength} members` : `${membersLength} member`;
  }
}
