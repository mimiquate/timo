import Controller from '@ember/controller';
import { computed, set, action } from '@ember/object';
import { compareMemberTimeZones, createMemberArray } from 'timo-frontend/utils/table-functions';
import { createMembersTableColumns, createMembersTableRows, createCollapsedColumns } from 'timo-frontend/utils/member-column-rows';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';
import openGoogleCalendarEvent from 'timo-frontend/utils/google-calendar';
import moment from 'moment';

export default Controller.extend({
  queryParams: {
    showCurrent: 'current',
    isCollapsed: 'collapsed'
  },

  showCurrent: false,
  isCollapsed: false,

  savedMembers: computed('model.members.{[],@each.id}', function () {
    return this.model.members.filterBy('id');
  }),

  sortedMembers: computed('savedMembers.{[],@each.name,@each.timezone}', 'showCurrent', function () {
    const timezoneNow = guessTimezoneNow();
    const membersToArray = createMemberArray(this.savedMembers, this.showCurrent, timezoneNow);

    return membersToArray.sort(compareMemberTimeZones);
  }),

  columns: computed('sortedMembers.[]', 'isCollapsed', function () {
    const timezoneNow = guessTimezoneNow();

    if (this.isCollapsed) {
      return createCollapsedColumns(this.sortedMembers, timezoneNow);
    }

    return createMembersTableColumns(this.sortedMembers, timezoneNow);
  }),

  rows: computed('sortedMembers.[]', function () {
    const timezoneNow = guessTimezoneNow();

    return createMembersTableRows(this.sortedMembers, timezoneNow);
  }),

  currentRowIndex: computed('rows.[]', function () {
    if (this.rows) {
      return this.rows.findIndex((row) => row.filter === 'row-current-time');
    }

    return 0;
  }),

  @action
  closeMemberModal(modal) {
    set(this, modal, false);
  },

  @action
  newMember() {
    set(this, 'newMemberModal', true);
  },

  @action
  async saveMember(memberName, memberTimeZone) {
    await this.store.createRecord('member', {
      name: memberName,
      timezone: memberTimeZone,
      team: this.model
    }).save().then(() => set(this, 'newMemberModal', false));
  },

  @action
  onHeaderClick(columnValue) {
    if (columnValue.valuePath != 'current' && !this.isCollapsed) {
      set(this, 'memberToEdit', columnValue.member);
      set(this, 'editMemberModal', true);
    }
  },

  @action
  async saveEditMember(memberName, memberTimeZone) {
    if (!(memberName === this.memberToEdit.name
      && memberTimeZone === this.memberToEdit.timezone)) {
      set(this.memberToEdit, 'name', memberName);
      set(this.memberToEdit, 'timezone', memberTimeZone);

      this.memberToEdit.save();
    }

    set(this, 'editMemberModal', false);
  },

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
});