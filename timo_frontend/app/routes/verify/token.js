import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'timo-frontend/config/environment';

export default Route.extend({
  ajax: service(),

  async beforeModel(transition) {
    this._super(...arguments);
    let params = transition.to.params;

    return this.ajax
      .patch(
        `${config.serverHost}/api/users/me?token=${params.token}`,
        {
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          }
        }
      ).then(() => {
        transition.abort();
        this.transitionTo('login');
      });
  }
});