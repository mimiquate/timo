import moment from 'moment';

export function createGroupedRows(timezones) {
  const timeNow = moment.utc();

  const timezoneByOffset = groupTimezonesByOffset(timezones, timeNow);
  const groupedTimezones = [];

  timezoneByOffset.forEach(timezones => {
    const times = timezones[0].times;
    const timezoneNameList = timezones.map(t => t.timezoneName);
    const membersArrays = timezones.map(t => t.members);
    const membersConcat = [].concat(...membersArrays);

    const newTimezone = {
      members: membersConcat,
      timezoneName: null,
      timezoneNameList,
      times
    }

    groupedTimezones.pushObject(newTimezone)
  });

  return groupedTimezones;
}

function groupTimezonesByOffset(timezones, timeNow) {
  return timezones.reduce(function (map, timezone) {
    const offset = moment.tz.zone(timezone.timezoneName).utcOffset(timeNow)

    if (!map.has(offset)) {
      map.set(offset, []);
    }

    map.get(offset).push(timezone);

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
      const startTime = currentMemberTime.clone().add(-12, 'hours');
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
