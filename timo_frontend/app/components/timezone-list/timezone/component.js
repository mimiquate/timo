import Component from '@glimmer/component';
import { computed } from '@ember/object';
import moment from 'moment';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import { splitTimezone } from 'timo-frontend/utils/table-functions';

export default class TimezoneComponent extends Component {
  @computed('args.timezone.members.[]')
  get location() {
    const timezoneNow = guessTimezoneNow();
    const timezoneNameList = this.args.timezone.timezoneNameList;
    const timezonesLength = timezoneNameList.length;
    const timezonesToShow = timezoneNameList.slice(0, 2);

    const splitedTimezones = timezonesToShow.map(t => {
      return splitTimezone(t, timezoneNow);
    });

    const otherTimezonesLength = timezonesLength - 2;
    if (otherTimezonesLength > 0) {
      let message = `${otherTimezonesLength} other `;
      message += otherTimezonesLength === 1 ? 'timezone' : 'timezones';
      splitedTimezones.pushObject(message);
    }

    return splitedTimezones.join(' + ');
  }

  @computed('args.{timezone.members.[],selectedTime}')
  get memberDate() {
    const timezone = this.args.timezone.timezoneNameList[0];
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
