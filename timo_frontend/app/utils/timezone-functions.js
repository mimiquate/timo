import moment from 'moment';

export function compareMemberTimeZones(memberA, memberB) {
  const aTime = moment.tz(memberA.timezone).format();
  const bTime = moment.tz(memberB.timezone).format();

  let ret = 0
  if (aTime < bTime) {
    ret = -1;
  } else if (aTime > bTime) {
    ret = 1;
  }

  return ret;
}

export function splitTimezone(timezone) {
  return timezone.replace(/\//g, ", ").replace(/_/g, " ")
}

export function addMoreHours(amount, index, timezones, currentIndex) {
  const timesLength = timezones[0].times.length;

  if (timesLength - index < currentIndex) {
    timezones.forEach(timezone => {
      const lastTimeValue = timezone.times[timesLength - 1].value;

      for (let i = 1; i <= amount; i++) {
        const value = lastTimeValue.clone().add(i, 'hour');
        const color = cellColor(value);
        const isCurrentTime = false;

        timezone.times.pushObject({
          value,
          color,
          isCurrentTime
        });
      }
    });
  }
}

function calculateAmountOfLeftBoxes(isForMobile) {
  if (isForMobile) {
    const timezonesWidth = document.getElementsByClassName('timezone-list')[0].clientWidth;
    const boxWidth = 50;

    return Math.floor((timezonesWidth/boxWidth)/2);
  } else {
    return 12;
  }
}

function addToSameTimezone(row, member) {
  if (!row.timezoneNameList.includes(member.timezone)) {
    row.timezoneNameList.pushObject(member.timezone);
  }

  row.members.pushObject(member);
}

export function createRows(sortedMembers, isGrouped, rowsForMobile) {
  const amountOfLeftBoxes = calculateAmountOfLeftBoxes(rowsForMobile);
  const timezoneRows = [];

  sortedMembers.forEach(m => {
    const isSameTimezone = isSameTimezoneCallback(m, isGrouped);
    const index = timezoneRows.findIndex(isSameTimezone);

    if (index > -1) {
      const sameRow = timezoneRows[index];

      addToSameTimezone(sameRow, m)

    } else {
      const currentMemberTime = moment.tz(m.timezone).startOf('hour');
      const startTime = currentMemberTime.clone().add(-amountOfLeftBoxes, 'hours');
      const times = [];

      for (let i = 0; i < 36; i++) {
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

export function cellColor(time) {
  const hour = time.hours();

  if (hour > 9 && hour < 18) {
    return 'green';
  } else if (hour < 8 || hour > 19) {
    return 'red';
  } else {
    return 'blue';
  }
}

function isSameTimezoneCallback(member, isGrouped) {
  const timeNow = moment.utc();
  const isSameOffset = (row) => {
    const offsetRow = moment.tz.zone(row.timezoneNameList[0]).utcOffset(timeNow);
    const offsetMember = moment.tz.zone(member.timezone).utcOffset(timeNow);

    return offsetRow === offsetMember;
  }

  const isSameTimezoneName = (row) => row.timezoneNameList.includes(member.timezone);

  return  (isGrouped ? isSameOffset : isSameTimezoneName);
}

export function compareTeamsByCreationTime(teamA, teamB) {
  const aCreationTime = teamA.inserted_at;
  const bCreationTime = teamB.inserted_at;

  let ret = 0
  if (aCreationTime < bCreationTime) {
    ret = -1;
  } else if (aCreationTime > bCreationTime) {
    ret = 1;
  }

  return ret;
}
