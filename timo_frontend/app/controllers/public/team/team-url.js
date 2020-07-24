import Controller from '@ember/controller';
import { computed, action } from '@ember/object';
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

  sortedMembers: computed('model.members.[]', 'showCurrent', function () {
    const timezoneNow = guessTimezoneNow();
    const membersToArray = createMemberArray(this.model.members, this.showCurrent, timezoneNow);

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