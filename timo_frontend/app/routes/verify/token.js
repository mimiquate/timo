import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  ajax: service(),

  async beforeModel(transition) {
    this._super(...arguments);
    let params = transition.to.params;

    return this.ajax
      .request(
        '/api/verify',
        {
          method: 'GET',
          data: {
            token: params.token
          }
        }
      ).then(() => {
        transition.abort();
        this.transitionTo('login');
      });
  }
});