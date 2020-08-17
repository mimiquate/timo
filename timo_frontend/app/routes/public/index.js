import Route from '@ember/routing/route';

export default class PublicIndexRoute extends Route {
  beforeModel() {
    this.transitionTo('');
  }
}