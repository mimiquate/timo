import Route from '@ember/routing/route';

export default class LandingTeamsNewRoute extends Route {
  resetController(controller) {
    controller.setProperties({
      teamName: ''
    });
  }
}