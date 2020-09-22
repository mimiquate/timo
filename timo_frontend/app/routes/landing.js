import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class LandingRoute extends Route.extend(AuthenticatedRouteMixin) {
  afterModel(model, transition) {
    if (model.length !== 0) {
      const teamToTransition = model.toArray().map(t => parseInt(t.id));
      const id = Math.min(...teamToTransition);

      this.transitionTo(`/teams/${id}`);
    } else {
      this.transitionTo('landing');
    }
  }

  model() {
    return this.store.findAll('team');
  }
}
