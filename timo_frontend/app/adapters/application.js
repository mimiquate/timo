import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'timo-frontend/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = config.serverHost;
  namespace = 'api';

  ajaxOptions() {
    return {
      ...super.ajaxOptions(...arguments),
      credentials: 'include'
    };
  }
}