import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { splitTimezone } from 'timo-frontend/utils/timezone-functions';
import moment from 'moment';

export default class TimezoneComponent extends Component {
  @computed('args.timezone.members.[]')
  get location() {
    const timezoneNameList = this.args.timezone.timezoneNameList;
    const timezonesLength = timezoneNameList.length;
    const timezonesToShow = timezoneNameList.slice(0, 2);

    const splitedTimezones = timezonesToShow.map(t => splitTimezone(t));

    const timezonesLeft = timezonesLength - 2;
    if (timezonesLeft > 0) {
      let message = `${timezonesLeft} other `;
      message += timezonesLeft === 1 ? 'timezone' : 'timezones';
      splitedTimezones.pushObject(message);
    }

    return splitedTimezones.join(' + ');
  }

  @computed('args.{timezone.members.[],selectedTime}')
  get memberDate() {
    const timezone = this.args.timezone.timezoneNameList[0];
    const selectedTime = this.args.selectedTime.format('YYYY-MM-DDTHH:mm:ssZ');

    return moment.tz(selectedTime, timezone).startOf('hour');
  }

  @computed('args.timezone.members.[]')
  get memberNames() {
    const members = this.args.timezone.members.map(m => m.name);
    const membersLength = members.length;
    let membersName = "";

    if (membersLength <= 4) {
      const lastMember = members[membersLength - 1];
      membersName = members.slice(0, membersLength - 1).join(", ");

      return membersLength === 1 ? `${lastMember}` : `${membersName} and ${lastMember}`;
    } else {
      const membersLeft = membersLength - 4;
      membersName = members.slice(0, 4).join(", ");

      return `${membersName} and ${membersLeft} more`;
    }
  }
}
