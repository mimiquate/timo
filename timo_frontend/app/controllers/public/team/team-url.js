import Controller from '@ember/controller';
import { computed } from "@ember/object";
import moment from 'moment';
import { compareMemberTimeZones, createMemberArray } from 'timo-frontend/utils/table-functions';
import { createMembersTableColumns, createMembersTableRows } from 'timo-frontend/utils/member-column-rows';

export default Controller.extend({
  sortedMembers: computed('model.members.[]', 'showCurrent', function () {
    const timezoneNow = moment.tz.guess(true);
    const membersToArray = createMemberArray(this.model.members, this.showCurrent, timezoneNow);

    return membersToArray.sort(compareMemberTimeZones);
  }),

  columns: computed('sortedMembers.[]', function () {
    return createMembersTableColumns(this.sortedMembers);
  }),

  rows: computed('sortedMembers.[]', function () {
    return createMembersTableRows(this.sortedMembers);
  })
});