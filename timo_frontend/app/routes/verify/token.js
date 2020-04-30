import Route from '@ember/routing/route';

export default Route.extend({
  async model(params) {
    const adapter = await this.store.adapterFor('user');

    return adapter.verifyEmail(params.token)
      .then(() => this.transitionTo('login'));
  }
});