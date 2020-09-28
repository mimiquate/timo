import moment from 'moment';

export function createNewRows(sortedMembers, isGrouped) {
  const timezoneRows = [];

  const timeNow = moment.utc();

  sortedMembers.forEach(m => {
    let { isSameOffset, isSameTimezoneName } = isSameTimeCallback(m, timeNow);
    const isSameTimezone = isGrouped ? isSameOffset : isSameTimezoneName;
    const sameTimezoneIndex = timezoneRows.findIndex(isSameTimezone);

    if (sameTimezoneIndex > -1) {
      const sameRow = timezoneRows[sameTimezoneIndex];

      if (!sameRow.timezoneNameList.includes(m.timezone)) {
        sameRow.timezoneNameList.pushObject(m.timezone);
      }

      sameRow.members.pushObject(m);

    } else {
      const currentMemberTime = moment.tz(m.timezone).startOf('hour');
      const startTime = currentMemberTime.clone().add(-12, 'hours');
      const times = [];

      for (let i = 0; i < 40; i++) {
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
        timezoneNameList: [m.timezone],
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

function isSameTimeCallback(member, timeNow) {
  const isSameOffset = (row) => {
    const offsetRow = moment.tz.zone(row.timezoneNameList[0]).utcOffset(timeNow);
    const offsetMember = moment.tz.zone(member.timezone).utcOffset(timeNow);

    return offsetRow === offsetMember;
  }

  const isSameTimezoneName = (row) => row.timezoneNameList.includes(member.timezone);

  return { isSameOffset, isSameTimezoneName };
}
