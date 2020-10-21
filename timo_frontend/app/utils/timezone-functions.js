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
