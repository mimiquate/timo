import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { splitTimezone } from 'timo-frontend/utils/timezone-functions';
import moment from 'moment';

export default class TimezoneComponent extends Component {
  @computed('args.timezone.members.{[],@each.city}')
  get location() {
    const members = this.args.timezone.members.filter(m => !m.isCurrentUser);

    const isCurrentLocation = this.args.timezone.members.find(m => m.isCurrentUser);
    let currentLocationLabel = isCurrentLocation ? 'Current location' : '';

    if (members.length !== 0 && isCurrentLocation) {
      currentLocationLabel = `(${currentLocationLabel})`;
    }

    const locations = [...new Set(members.map(m => m.city.fullName))];

    const locationsLength = locations.length;
    const locationsToShow = locations.map(l => splitTimezone(l)).slice(0, 2);

    const locationsLeft = locationsLength - 2;
    if (locationsLeft > 0) {
      let message = `${locationsLeft} other `;
      message += locationsLeft === 1 ? 'location' : 'locations';
      locationsToShow.pushObject(message);
    }

    const concatenatedLocations = locationsToShow.join(' + ');
    return `${concatenatedLocations} ${currentLocationLabel}`;
  }

  @computed('args.{timezone.members.[],selectedTime}')
  get memberDate() {
    const timezone = this.args.timezone.timezonesList[0];
    const selectedTime = this.args.selectedTime;

    return moment.tz(selectedTime, timezone).startOf('hour');
  }

  @computed('args.timezone.members.[]')
  get memberNames() {
    const members = this.args.timezone.members.filter(m => m.name !== 'Current location').map(m => m.name);
    const membersLength = members.length;
    let membersName;

    if (membersLength === 0) {
      return 'You';
    }

    if (membersLength <= 4) {
      const lastMember = members[membersLength - 1];

      if (membersLength === 1) {
        return `${lastMember}`;
      } else {
        membersName = members.slice(0, membersLength - 1).join(", ");

        return `${membersName} and ${lastMember}`;
      }
    } else {
      const membersLeft = membersLength - 4;

      membersName = members.slice(0, 4).join(", ");

      return `${membersName} and ${membersLeft} more`;
    }
  }
}
