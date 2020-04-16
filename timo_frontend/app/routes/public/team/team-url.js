import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord(
      'team',
      params.url,
      { include: 'members', reload: true }
    );
  }
});