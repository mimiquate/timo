import Route from '@ember/routing/route';

export default Route.extend({
  resetController(controller) {
    controller.setProperties({
      memberName: '',
      memberTimeZone: ''
    });
  }
});