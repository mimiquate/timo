import moment from 'moment';
import { isEmpty } from '@ember/utils';

export function createMembersTableColumns(sortedMembers, timezoneNow) {
  const memberCol = [];

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

  const earlyTimezone = sortedMembers[0].timezone;
  const lateTimezone = sortedMembers[sortedMembers.length - 1].timezone;

  const startHour = moment.tz(moment.tz(earlyTimezone).startOf('day'), lateTimezone).startOf('day');
  const endHour = moment.tz(earlyTimezone).endOf('day');

  const momentNow = moment();
  let time = moment(startHour);
  const hoursEnd = endHour.diff(startHour, 'hours');

  for (let i = 0; i < hoursEnd + 1; i++) {
    let diff = time.diff(momentNow, 'minutes');
    let filter = '';

    if (diff >= 0 && diff < 60) {
      filter = 'row-current-time';
    } else if (diff < 0) {
      filter = 'row-past-time';
    }

    row = {
      filter: filter,
      time: moment(time)
    };

    sortedMembers.forEach(m => {
      row[m.id] = moment.tz(time, m.timezone);
    });

    memberRows.pushObject(row);
    time.add(1, 'hour');
  }

  return memberRows;
}

export function createCollapsedColumns(sortedMembers, timezoneNow) {
  const timeNow = moment.utc();

  const membersByOffset = groupMembersByOffset(sortedMembers, timeNow);

  return Array.from(membersByOffset).map(args => {
    const members = args[1];

    const findMember = members.find(m => m.id === 'current');
    const member = findMember ? findMember : members[0];

    const isCurrentTimezone = members.some(m => m.timezone === timezoneNow);

    return {
      member: member,
      valuePath: member.id,
      textAlign: 'center',
      width: 225,
      isCurrent: isCurrentTimezone,
      collapsedMembersCount: members.length
    };
  })
}

function groupMembersByOffset(sortedMembers, timeNow) {
  return sortedMembers.reduce(function (map, member) {
    const offset = moment.tz.zone(member.timezone).utcOffset(timeNow)

    if (!map.has(offset)) {
      map.set(offset, []);
    }

    map.get(offset).push(member);

    return map;
  }, new Map());
}

export function createNewRows(sortedMembers) {
  if (isEmpty(sortedMembers)) {
    return [];
  }

  const memberCol = [];

  sortedMembers.forEach(m => {
    memberCol.pushObject({
      member: m,
      times: []
    })
  });

  const earlyTimezone = sortedMembers[0].timezone;
  const lateTimezone = sortedMembers[sortedMembers.length - 1].timezone;

  const startHour = moment.tz(moment.tz(earlyTimezone).startOf('day'), lateTimezone).startOf('day');
  const endHour = moment.tz(earlyTimezone).endOf('day');

  const momentNow = moment();
  let time = moment(startHour);
  const hoursEnd = endHour.diff(startHour, 'hours');

  for (let i = 0; i < hoursEnd + 1; i++) {
    const diff = time.diff(momentNow, 'minutes');
    const currentTime = (diff >= 0 && diff < 60) ? true : false;

    memberCol.forEach(col => {
      const value = moment.tz(time, col.member.timezone);
      const color = cellColor(value);
      const calendarTime = moment(time);

      col.times.pushObject({
        value,
        currentTime,
        calendarTime,
        color
      });
    });

    time.add(1, 'hour');
  }

  return memberCol;
}

function cellColor(time) {
  const hour = time.hours();
  let color = '';

  if (hour >= 8 && hour <= 17) {
    color = 'green';
  } else if (hour >= 18 && hour <= 21) {
    color = 'blue';
  } else {
    color = 'red';
  }

  return color
}
