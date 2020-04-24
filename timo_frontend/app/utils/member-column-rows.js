import { hoursLeftOver, filterClass } from 'timo-frontend/utils/table-functions';
import moment from 'moment';
import { isEmpty } from '@ember/utils';

export function createMembersTableColumns(sortedMembers) {
  const memberCol = [];

  const timezoneNow = moment.tz.guess(true);

  sortedMembers.forEach(m => {
    memberCol.pushObject({
      member: m,
      valuePath: m.id,
      textAlign: 'center',
      width: 225,
      isCurrent: timezoneNow === m.timezone
    })
  });

  return memberCol;
}

export function createMembersTableRows(sortedMembers) {
  if (isEmpty(sortedMembers)) {
    return {};
  }

  const memberRows = [];
  let row = {};

  const hours = hoursLeftOver(sortedMembers, new Date());
  const hoursStart = hours[0];
  const hoursEnd = 24 + hours[1];

  const momentNow = moment();
  const hoursTime = momentNow.hours();
  let time = momentNow.minute(0);
  time.hour(0);
  time.subtract(hoursStart, 'hour');

  for (let i = 0; i < hoursEnd; i++) {
    row = { filter: filterClass(i, hoursStart, hoursTime) };

    sortedMembers.forEach(m => {
      row[m.id] = moment.tz(time, m.timezone);
    });

    memberRows.pushObject(row);
    time.add(1, 'hour');
  }

  return memberRows;
}