import moment from 'moment';

export function compareTimeZones(memberA, memberB) {
  const aTime = moment.tz(memberA.timezone).format();
  const bTime = moment.tz(memberB.timezone).format();

  if (aTime < bTime) {
    return -1;
  }

  if (aTime > bTime) {
    return 1;
  }

  return 0;
}

export function hoursLeftOver(membersArray) {
  const length = membersArray.length;

  const now = moment.utc();
  const offSetNow = new Date().getTimezoneOffset();

  const earlyTZ = membersArray[length - 1].timezone;
  const earlyTime = moment.tz.zone(earlyTZ).utcOffset(now);
  const hoursStart = (offSetNow - earlyTime) / 60;

  const lateTz = membersArray[0].timezone;
  const lateTime = moment.tz.zone(lateTz).utcOffset(now);
  const hoursLeft = (lateTime - earlyTime) / 60;

  return [hoursStart, hoursLeft];
}

export function filterClass(hour, offset) {
  const hourNow = moment().hours() + offset;

  if (hour < hourNow) {
    return 'row-past-time';
  }

  if (hour == hourNow) {
    return 'row-current-time';
  }

  return '';
}
