import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { compareMemberTimeZones, createRows } from 'timo-frontend/utils/timezone-functions';
import openGoogleCalendarEvent from 'timo-frontend/utils/google-calendar';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import moment from 'moment';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DynamicTeamController extends Controller {
  @tracked selectedBoxIndex = this.currentIndex;
  @tracked selectedTime = moment();
  @tracked isGrouped = false;
  @tracked isShowingCalendarPopover = false;

  @service media;
  @service session;

  @computed('model.{[],@each.name,@each.timezone}')
  get sortedMembers() {
    const members = this.model.members.toArray();
    members.sort(compareMemberTimeZones);

    const timezoneNow = guessTimezoneNow();
    members.unshiftObject({
      name: 'Current location',
      isCurrentUser: true,
      timezone: timezoneNow,
      id: 'current'
    });

    return members;
  }

  @computed('sortedMembers.[]', 'isGrouped', 'media')
  get timezones() {
    return createRows(this.sortedMembers, this.isGrouped, this.media.isMobile);
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

  @action
  toggleCalendarPopoverBackground(value) {
    this.isShowingCalendarPopover = value;
  }
}
