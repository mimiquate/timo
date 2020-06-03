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

export function hoursLeftOver(membersArray, timezoneNow) {
  const length = membersArray.length;

  const offSetNow = moment().tz(timezoneNow).utcOffset();

  const earlyTZ = membersArray[length - 1].timezone;
  const earlyTime = moment.tz(earlyTZ).utcOffset();
  const hoursStart = (earlyTime - offSetNow) / 60;

  const lateTz = membersArray[0].timezone;
  const lateTime = moment.tz(lateTz).utcOffset();
  const hoursLeft = (earlyTime - lateTime) / 60;

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

export function createMemberArray(modelMembers, showCurrent, timezoneNow) {
  const returnArray = modelMembers.toArray();

  if (showCurrent) {
    const hasCurrent = returnArray.some(m => {
      return m.timezone === timezoneNow;
    });

    if (!hasCurrent) {
      returnArray.pushObject({
        name: 'You',
        timezone: timezoneNow,
        id: 'current'
      });
    }
  }

  return returnArray;
}
