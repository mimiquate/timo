import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default class LandingTeamsTeamRoute extends Route {
  model(params) {
    const teams = this.modelFor('landing');
    const team = this.store.findRecord(
      'team',
      params.id,
      { include: 'members.city', reload: true }
    );

    return hash({
      teams,
      team
    })
  }
}
