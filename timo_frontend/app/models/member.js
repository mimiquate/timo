import Model, { attr, belongsTo } from '@ember-data/model';
import { splitTimezone } from 'timo-frontend/utils/timezone-functions';

export default class MemberModel extends Model {
  @attr('string') name;
  @belongsTo('team') team;
  @belongsTo('city', { async: false }) city;

  get location() {
    if (this.city) {
      return this.city.fullName;
    } else {
      return splitTimezone(this.timezone);
    }
  }
}
