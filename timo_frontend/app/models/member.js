import Model, { attr, belongsTo } from '@ember-data/model';

export default class MemberModel extends Model {
  @attr('string') name;
  @attr('string') timezone;
  @belongsTo('team') team;
  @belongsTo('city', { async: false }) city;

  get location() {
    if (this.city) {
      return this.city.fullName;
    } else {
      return this.timezone;
    }
  }
}