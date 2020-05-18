import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord(
      'team',
      params.id,
      { include: 'members', reload: true }
    );
  },

  resetController(controller) {
    controller.setProperties({
      didScroll: false
    });
  }
});