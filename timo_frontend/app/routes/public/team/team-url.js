import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.queryRecord('team', {
      filter: {
        share_id: params.share_id
      },
      include: 'members'
    });
  }
});