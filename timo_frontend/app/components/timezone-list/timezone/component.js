import Component from '@glimmer/component';
import { computed } from '@ember/object';
import moment from 'moment';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import { splitTimezone } from 'timo-frontend/utils/table-functions';

export default class TimezoneComponent extends Component {
  @computed('args.timezone.members.[]')
  get location() {
    const timezoneNow = guessTimezoneNow();
    const timezone = this.args.timezone.timezoneName;

    if (!timezone) {
      const timezoneNameList = this.args.timezone.timezoneNameList;

      const timezonesSplited = timezoneNameList.map(t => {
        return splitTimezone(t, timezoneNow);
      });

      return timezonesSplited.join(' + ');
    }

    return splitTimezone(timezone, timezoneNow);
  }

  @computed('args.{timezone.members.[],selectedTime}')
  get memberDate() {
    const timezone = this.args.timezone.timezoneName || this.args.timezone.timezoneNameList[0];
    const selectedTime = this.args.selectedTime.format('YYYY-MM-DDTHH:mm:ssZ');
    const formatedDate = moment.tz(selectedTime, timezone).startOf('hour');
    const format = "dddd, DD MMMM YYYY, HH:mm";

    return formatedDate.format(format);
  }

  @computed('args.timezone.members.[]')
  get amountOfMembersMessage() {
    const membersLength = this.args.timezone.members.length;

    return membersLength > 1 ? `${membersLength} members` : `${membersLength} member`;
  }
}
