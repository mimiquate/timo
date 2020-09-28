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
