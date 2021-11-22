import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicIndexRoute extends Route {
  @service router;

  beforeModel() {
    this.router.transitionTo('');
  }
}
