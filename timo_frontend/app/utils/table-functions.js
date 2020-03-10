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

export function hoursLeftOver(membersArray, date) {
  const length = membersArray.length;

  const now = moment.utc(date);
  const offSetNow = date.getTimezoneOffset();

  const earlyTZ = membersArray[length - 1].timezone;
  const earlyTime = moment.tz.zone(earlyTZ).utcOffset(now);
  const hoursStart = (offSetNow - earlyTime) / 60;

  const lateTz = membersArray[0].timezone;
  const lateTime = moment.tz.zone(lateTz).utcOffset(now);
  const hoursLeft = (lateTime - earlyTime) / 60;

  return [hoursStart, hoursLeft];
}

export function filterClass(hour, offset, hoursTime) {
  const hourNow = hoursTime + offset;

  let retClass = '';
  if (hour < hourNow) {
    retClass = 'row-past-time';
  } else if (hour === hourNow) {
    retClass = 'row-current-time';
  }

  return retClass;
}

export function createMemberArray(modelMembers, showCurrent) {
  const returnArray = modelMembers.toArray();

  const timezoneNow = moment.tz.guess(true);
  if (showCurrent) {
    const hasCurrent = returnArray.some(m => {
      return m.timezone == timezoneNow;
    });
    if (!hasCurrent) {
      returnArray.pushObject({
        name: 'Your current timezone',
        timezone: timezoneNow,
        id: 'current'
      });
    }
  }

  return returnArray;
}
