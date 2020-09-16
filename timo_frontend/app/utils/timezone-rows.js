import moment from 'moment';

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
  const timezoneRows = [];

  sortedMembers.forEach(m => {
    const isSameTimezone = (row) => row.timezoneName === m.timezone;
    const sameTimezoneIndex = timezoneRows.findIndex(isSameTimezone);

    if (sameTimezoneIndex > -1) {
      timezoneRows[sameTimezoneIndex].members.pushObject(m);
    } else {
      const currentMemberTime = moment.tz(m.timezone).startOf('hour');
      const startTime = currentMemberTime.clone().add(-20, 'hours');
      const times = [];

      for(let i = 0; i < 40; i++) {
        const value = startTime.clone().add(i, 'hour');
        const color = cellColor(value);
        const diff = value.diff(currentMemberTime, 'hours');
        const isCurrentTime = diff == 0;

        times.pushObject({
          value,
          color,
          isCurrentTime
        });
      }

      timezoneRows.pushObject({
        members: [m],
        timezoneName: m.timezone,
        times
      })
    }
  });

  return timezoneRows;
}

function cellColor(time) {
  const hour = time.hours();
  let color = '';

  if (hour > 9 && hour < 18) {
    color = 'green';
  } else if (hour < 8 || hour > 19) {
    color = 'red';
  } else {
    color = 'blue';
  }

  return color
}
