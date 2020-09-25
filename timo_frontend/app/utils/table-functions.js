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

export function splitTimezone(timezone, timezoneNow) {
  let ret = "";

  ret = timezone
    .replace(/\//g, ", ")
    .replace(/_/g, " ")

  if (timezone === timezoneNow) {
    ret += " (you)";
  }

  return ret;
}
