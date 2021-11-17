import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';

export default class LandingRoute extends Route.extend(AuthenticatedRouteMixin) {
  @service session;
  @service currentUser;
  @service router;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');

    if (this.session.isAuthenticated) {
      await this.currentUser.load();
    }
  };

  afterModel(model, transition) {
    const correctTarget = transition.targetName === 'landing.index' || transition.targetName === 'landing.teams.index';
    if (correctTarget && model.length !== 0) {
      const teamToTransition = model.toArray().map(t => parseInt(t.id));
      const id = Math.min(...teamToTransition);

      this.router.transitionTo(`/teams/${id}`);
    }
  }

  model() {
    this.store.unloadAll('team');

    return this.store.findAll('team');
  }
}
