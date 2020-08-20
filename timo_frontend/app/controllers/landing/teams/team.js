import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { compareMemberTimeZones, createMemberArray } from 'timo-frontend/utils/table-functions';
import { createNewRows } from 'timo-frontend/utils/member-column-rows';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import openGoogleCalendarEvent from 'timo-frontend/utils/google-calendar';
import moment from 'moment';
import ENV from 'timo-frontend/config/environment';

export default class LandingTeamsTeamController extends Controller {
  queryParams = [
    { showCurrent: 'current' },
    { isCollapsed: 'collapsed' }
  ];

  @tracked memberToEdit = null;
  @tracked newMemberModal = false;
  @tracked editMemberModal = false;

  showCurrent = false;
  isCollapsed = false;
  renderAll = ENV.environment === 'test';

  @computed('sortedMembers.[]')
  get timezones() {
    return createNewRows(this.sortedMembers);
  }

  @computed('model.members.{[],@each.id}')
  get savedMembers() {
    return this.model.members.filterBy('id');
  }

  @computed('savedMembers.{[],@each.name,@each.timezone}', 'showCurrent')
  get sortedMembers() {
    const timezoneNow = guessTimezoneNow();
    const membersToArray = createMemberArray(this.savedMembers, this.showCurrent, timezoneNow);

    return membersToArray.sort(compareMemberTimeZones);
  }

  @action
  closeEditMemberModal() {
    this.editMemberModal = false;
  }

  @action
  closeNewMemberModal() {
    this.newMemberModal = false;
  }

  @action
  newMember() {
    this.newMemberModal = true;
  }

  @action
  async saveMember(memberName, memberTimeZone) {
    await this.store.createRecord('member', {
      name: memberName,
      timezone: memberTimeZone,
      team: this.model
    }).save().then(() => this.newMemberModal = false);
  }

  @action
  async saveEditMember(memberName, memberTimeZone) {
    if (!(memberName === this.memberToEdit.name
      && memberTimeZone === this.memberToEdit.timezone)) {
      this.memberToEdit.name = memberName;
      this.memberToEdit.timezone = memberTimeZone

      this.memberToEdit.save();
    }

    this.editMemberModal = false;
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
