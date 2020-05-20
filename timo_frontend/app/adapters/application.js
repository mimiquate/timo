import DS from 'ember-data';
import config from 'timo-frontend/config/environment';

export default DS.JSONAPIAdapter.extend({
  host: config.serverHost,
  namespace: 'api'
});