import Model, { attr, belongsTo } from '@ember-data/model';

export default class MemberModel extends Model {
  @attr('string') name;
  @belongsTo('team') team;
  @belongsTo('city', { async: false }) city;
}
