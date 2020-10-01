import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { compareMemberTimeZones } from 'timo-frontend/utils/table-functions';
import { createNewRows } from 'timo-frontend/utils/timezone-rows';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import openGoogleCalendarEvent from 'timo-frontend/utils/google-calendar';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';

export default class PublicTeamTeamUrlController extends Controller {
  queryParams = [{ isGrouped: 'groupTimezones' }];

  @tracked selectedBoxIndex = this.currentIndex;
  @tracked selectedTime = moment();
  @tracked isGrouped = false;

  @computed('model.members.{[],@each.id}')
  get savedMembers() {
    return this.model.members.filterBy('id');
  }

  @computed('savedMembers.{[],@each.name,@each.timezone}')
  get sortedMembers() {
    const membersToArray = this.savedMembers.toArray();
    membersToArray.sort(compareMemberTimeZones);

    const timezoneNow = guessTimezoneNow();
    membersToArray.unshiftObject({
      name: 'You',
      timezone: timezoneNow,
      id: 'current'
    });

    return membersToArray;
  }

  @computed('sortedMembers.[]', 'isGrouped')
  get timezones() {
    return createNewRows(this.sortedMembers, this.isGrouped);
  }

  @computed('timezones')
  get currentIndex() {
    return this.timezones[0].times.findIndex((t) => t.isCurrentTime);
  }

  @action
  groupTimezones() {
    this.toggleProperty('isGrouped');
  }

  @action
  selectBox(index, time) {
    this.selectedBoxIndex = index;
    this.selectedTime = time;
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

  @action
  transitionToLogin() {
    this.transitionToRoute('/login');
  }

  @action
  transitionToSignUp() {
    this.transitionToRoute('/sign-up');
  }
}
