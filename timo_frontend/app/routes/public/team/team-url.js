import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicTeamTeamUrlRoute extends Route {
  @service store;

  model(params) {
    return this.store.queryRecord('team', {
      filter: {
        share_id: params.share_id
      },
      include: 'members.city'
    });
  }
}
