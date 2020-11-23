import TimezoneRow from 'timo-frontend/utils/timezone-row';
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
      const lastTimeValue = timezone.lastTimeValue;

      for (let i = 1; i <= amount; i++) {
        const value = lastTimeValue.clone().add(i, 'hour');
        const isCurrentTime = false;

        timezone.times.pushObject({ value, isCurrentTime });
      }
    });
  }
}

export function createRows(sortedMembers, isGrouped, isMobile) {
  const amountOfLeftBoxes = getAmountOfBoxesBeforeNow(isMobile);
  const timezoneRows = [];

  sortedMembers.forEach(member => {
    let timezone;

    if (isGrouped) {
      timezone = timezoneRows.find(tz => tz.memberHasSameOffset(member));
    } else {
      timezone = timezoneRows.find(tz => tz.memberHasSameTimezone(member));
    }

    if (timezone) {
      timezone.addToSameTimezone(member)
    } else {
      createNewTimezone(timezoneRows, member, amountOfLeftBoxes);
    }
  });

  return timezoneRows;
}

function getAmountOfBoxesBeforeNow(isMobile) {
  if (isMobile) {
    const timezonesWidth = document.getElementsByClassName('timezone-list')[0].clientWidth;
    const boxWidth = 50;
    const amountOfBoxes = timezonesWidth / boxWidth;

    return Math.floor(amountOfBoxes / 2);
  } else {
    return 12;
  }
}

function createNewTimezone(timezoneRows, member, boxesToTheLeft) {
  const currentMemberTime = moment.tz(member.timezone).startOf('hour');
  const hours = createHours(currentMemberTime, boxesToTheLeft);
  const row = new TimezoneRow(member, hours);

  timezoneRows.pushObject(row);
}

function createHours(currentMemberTime, boxesToTheLeft) {
  const hours = [];
  const boxesInsideTimezone = 36;
  const startTime = currentMemberTime.clone().add(-boxesToTheLeft, 'hours');

  for (let i = 0; i < boxesInsideTimezone; i++) {
    const value = startTime.clone().add(i, 'hour');
    const isCurrentTime = value.diff(currentMemberTime, 'hours') == 0;

    hours.pushObject({ value, isCurrentTime });
  }

  return hours;
}
