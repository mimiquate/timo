import { hoursLeftOver, filterClass } from 'timo-frontend/utils/table-functions';
import moment from 'moment';
import { isEmpty } from '@ember/utils';
import guessTimezoneNow from 'timo-frontend/utils/guess-timezone-now';

export function createMembersTableColumns(sortedMembers) {
  const memberCol = [];

  const timezoneNow = guessTimezoneNow();

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

export function createMembersTableRows(sortedMembers, timezoneNow) {
  if (isEmpty(sortedMembers)) {
    return {};
  }

  const memberRows = [];
  let row = {};

  const hours = hoursLeftOver(sortedMembers, timezoneNow);
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