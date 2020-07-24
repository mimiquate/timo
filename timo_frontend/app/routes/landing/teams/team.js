import Route from '@ember/routing/route';

export default class LandingTeamsTeamRoute extends Route {
  model(params) {
    return this.store.findRecord(
      'team',
      params.id,
      { include: 'members', reload: true }
    );
  }

  resetController(controller) {
    controller.setProperties({
      showCurrent: false,
      isCollapsed: false
    });
  }
}