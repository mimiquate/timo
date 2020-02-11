import DS from 'ember-data';
const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  name: attr('string'),
  user: belongsTo('user'),
  members: hasMany('member', { async: false })
});
