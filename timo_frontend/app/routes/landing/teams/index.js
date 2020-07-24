import Route from '@ember/routing/route';

export default class LandingTeamsIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('landing');
  }
}