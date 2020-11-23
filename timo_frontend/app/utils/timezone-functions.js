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
      const lastTimeValue = timezone.lastTimeValue();

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
      timezone = timezoneRows.find(tz => tz.isSameOffset(member));
    } else {
      timezone = timezoneRows.find(tz => tz.memberIsInTimezone(member));
    }

    if (timezone) {
      timezone.addToSameTimezone(member)
    } else {
      createNewTimezone(timezoneRows, member, amountOfLeftBoxes);
    }
  });

  return timezoneRows;
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
  const startTime = currentMemberTime.clone().add(-boxesToTheLeft, 'hours');
  const times = [];
  const boxesInsideTimezone = 36;

  for (let i = 0; i < boxesInsideTimezone; i++) {
    const value = startTime.clone().add(i, 'hour');
    const isCurrentTime = value.diff(currentMemberTime, 'hours') == 0;

    times.pushObject({ value, isCurrentTime });
  }

  const row = new Timezone(member, times);
  timezoneRows.pushObject(row);
}

class Timezone {
  members = [];
  times = [];
  timezonesList = [];

  constructor(member, times) {
    this.members.pushObject(member);
    this.times = times;
    this.timezonesList.pushObject(member.timezone);
  }

  get timezoneName() {
    return this.members[0].timezone;
  }

  get offset() {
    return moment.tz.zone(this.timezoneName).utcOffset(moment.utc());
  }

  getLastTimeValue() {
    return this.times[this.times.length - 1].value;
  }

  memberIsInTimezone(member) {
    return this.timezonesList.includes(member.timezone);
  }

  isSameOffset(member) {
    const offsetMember = moment.tz.zone(member.timezone).utcOffset(moment.utc());

    return this.offset === offsetMember;
  }

  addToSameTimezone(member) {
    if (!this.timezonesList.includes(member.timezone)) {
      this.timezonesList.pushObject(member.timezone);
    }

    this.members.pushObject(member);
  }
}
