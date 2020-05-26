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

export function createColapsedColumns(sortedMembers) {
  const memberCol = [];

  const timezoneNow = moment.tz.guess(true);
  const time = moment().minute(0);
  time.hour(0);

  sortedMembers.forEach(m => {
    const sameHourIndex = sameHourInColumns(m, memberCol, time);

    if (sameHourIndex >= 0) {
      memberCol[sameHourIndex].colapsedMembers++;
      memberCol[sameHourIndex].isCurrent |= (timezoneNow === m.timezone);
    } else {
      memberCol.pushObject({
        member: m,
        valuePath: m.id,
        textAlign: 'center',
        width: 225,
        isCurrent: timezoneNow === m.timezone,
        colapsedMembers: 0
      });
    }
  });

  return memberCol;
}

function sameHourInColumns(member, columns, time) {
  const memberTimezoneTime = moment.tz(time, member.timezone).format("D MMM YYYY - HH:mm");

  const index = columns.findIndex((col) => {
    const colTimezone = col.member.timezone;
    const colTimeZoneTime = moment.tz(time, colTimezone).format("D MMM YYYY - HH:mm");

    return colTimeZoneTime === memberTimezoneTime;
  });

  return index;
}