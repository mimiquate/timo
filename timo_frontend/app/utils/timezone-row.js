import moment from 'moment';

export default class TimezoneRow {
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

  get lastTimeValue() {
    return this.times[this.times.length - 1].value;
  }

  addHour(hour) {
    this.times.pushObject(hour);
  }

  memberHasSameTimezone(member) {
    return this.timezonesList.includes(member.timezone);
  }

  memberHasSameOffset(member) {
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
