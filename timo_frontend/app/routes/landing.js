import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class LandingRoute extends Route.extend(AuthenticatedRouteMixin) {
  afterModel(model, transition) {
    const correctTarget = transition.targetName === 'landing.index' || transition.targetName === 'landing.teams.index';
    if (correctTarget && model.length !== 0) {
      const teamToTransition = model.toArray().map(t => parseInt(t.id));
      const id = Math.min(...teamToTransition);

      this.transitionTo(`/teams/${id}`);
    }
  }

  model() {
    this.store.unloadAll('team');

    return this.store.findAll('team');
  }
}
