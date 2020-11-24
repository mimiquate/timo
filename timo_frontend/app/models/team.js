import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class TeamModel extends Model {
  @attr('string') name;
  @belongsTo('user') user;
  @hasMany('member', { async: false }) members;
  @attr('string') share_id;
  @attr('boolean') public;
}
