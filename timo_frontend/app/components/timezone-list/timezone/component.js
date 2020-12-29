import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { splitTimezone } from 'timo-frontend/utils/timezone-functions';
import moment from 'moment';

export default class TimezoneComponent extends Component {
  @computed('args.timezone.members.{[],@each.city}')
  get location() {
    const members = this.args.timezone.members;
    const hasCitylessMember = members.some(m => m.city === null);
    let locations;
    if (hasCitylessMember) {
      locations = this.args.timezone.timezonesList.map(t => splitTimezone(t));
    } else {
      locations = [...new Set(members.map(m => m.location))];
    }
    const locationsLength = locations.length;
    const locationsToShow = locations.slice(0, 2);

    const locationsLeft = locationsLength - 2;
    if (locationsLeft > 0) {
      let message = `${locationsLeft} other `;
      message += locationsLeft === 1 ? 'location' : 'locations';
      locationsToShow.pushObject(message);
    }

    return locationsToShow.join(' + ');
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
    const isCurrentLocation = this.args.timezone.members.find(m => m.name === 'Current location');
    const currentLocationLabel = isCurrentLocation ? '(Current location)' : '';
    const membersLength = members.length;
    let membersName;

    if (membersLength === 0) {
      return 'Current location';
    }

    if (membersLength <= 4) {
      const lastMember = members[membersLength - 1];

      if (membersLength === 1) {
        return `${lastMember} ${currentLocationLabel}`;
      } else {
        membersName = members.slice(0, membersLength - 1).join(", ");

        return `${membersName} and ${lastMember} ${currentLocationLabel}`;
      }
    } else {
      const membersLeft = membersLength - 4;

      membersName = members.slice(0, 4).join(", ");

      return `${membersName} and ${membersLeft} more ${currentLocationLabel}`;
    }
  }
}
