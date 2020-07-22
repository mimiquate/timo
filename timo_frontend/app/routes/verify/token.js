import Route from '@ember/routing/route';
import config from 'timo-frontend/config/environment';
import fetch from 'fetch';

export default Route.extend({
  async beforeModel(transition) {
    this._super(...arguments);
    let params = transition.to.params;

    let response = await fetch(
      `${config.serverHost}/api/users/me?token=${params.token}`,
      {
        method: 'PATCH',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        },
        credentials: 'include'
      }
    );

    if (!response.ok) {
      let error = await response.json();
      throw error;
    }

    transition.abort();
    this.transitionTo('login');
  }
});