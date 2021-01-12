import Route from '@ember/routing/route';

export default class PublicTeamTeamUrlRoute extends Route {
  model(params) {
    return this.store.queryRecord('team', {
      filter: {
        share_id: params.share_id
      },
      include: 'members.city'
    });
  }
}
