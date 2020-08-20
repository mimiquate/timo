import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { compareMemberTimeZones, createMemberArray } from 'timo-frontend/utils/table-functions';
import { createNewRows } from 'timo-frontend/utils/member-column-rows';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import openGoogleCalendarEvent from 'timo-frontend/utils/google-calendar';
import moment from 'moment';
import ENV from 'timo-frontend/config/environment';

export default class PublicTeamTeamUrlController extends Controller {
  queryParams = [
    { showCurrent: 'current' },
    { isCollapsed: 'collapsed' }
  ];

  showCurrent = false;
  isCollapsed = false;
  renderAll = ENV.environment === 'test';

  @computed('model.members.[]', 'showCurrent')
  get sortedMembers() {
    const timezoneNow = guessTimezoneNow();
    const membersToArray = createMemberArray(this.model.members, this.showCurrent, timezoneNow);

    return membersToArray.sort(compareMemberTimeZones);
  }

  @computed('sortedMembers.[]')
  get timezones() {
    return createNewRows(this.sortedMembers);
  }

  @action
  scheduleEvent(time) {
    let rowTime = moment(time);

    rowTime.seconds(0)
    const googleFormatTimeStart = rowTime.format('YYYYMMDDTHHmmss');

    rowTime.add(1, 'hour');
    const googleFormatTimeEnd = rowTime.format('YYYYMMDDTHHmmss');

    const url = `${googleFormatTimeStart}/${googleFormatTimeEnd}`;
    openGoogleCalendarEvent(url, this.model.name);
  }
}
