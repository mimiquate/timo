import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { compareMemberTimeZones, createMemberArray } from 'timo-frontend/utils/table-functions';
import { createMembersTableColumns, createMembersTableRows, createCollapsedColumns } from 'timo-frontend/utils/member-column-rows';
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

  @tracked showCurrent = false;
  @tracked isCollapsed = false;
  renderAll = ENV.environment === 'test';

  get savedMembers() {
    return this.model.members.filterBy('id');
  }

  get sortedMembers() {
    const timezoneNow = guessTimezoneNow();
    const membersToArray = createMemberArray(this.savedMembers, this.showCurrent, timezoneNow);

    return membersToArray.sort(compareMemberTimeZones);
  }

  get columns() {
    const timezoneNow = guessTimezoneNow();

    if (this.isCollapsed) {
      return createCollapsedColumns(this.sortedMembers, timezoneNow);
    }

    return createMembersTableColumns(this.sortedMembers, timezoneNow);
  }

  get rows() {
    return createMembersTableRows(this.sortedMembers);
  }

  get currentRowIndex() {
    if (this.rows) {
      return this.rows.findIndex((row) => row.filter === 'row-current-time');
    }

    return 0;
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
  onHeaderClick(columnValue) {
    if (columnValue.valuePath != 'current' && !this.isCollapsed) {
      this.memberToEdit = columnValue.member;
      this.editMemberModal = true;
    }
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
  scheduleEvent(row) {
    let rowTime = moment(row.rowValue.time);

    rowTime.seconds(0)
    const googleFormatTimeStart = rowTime.format('YYYYMMDDTHHmmss');

    rowTime.add(1, 'hour');
    const googleFormatTimeEnd = rowTime.format('YYYYMMDDTHHmmss');

    const time = `${googleFormatTimeStart}/${googleFormatTimeEnd}`;
    openGoogleCalendarEvent(time, this.model.name);
  }
}