import Route from '@ember/routing/route';

export default Route.extend({
  async beforeModel(transition) {
    this._super(...arguments);
    let params = transition.to.params;
    const adapter = await this.store.adapterFor('user');

    return adapter.verifyEmail(params.token)
      .then(() => {
        transition.abort();
        this.transitionTo('login');
      });
  }
});