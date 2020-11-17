import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PublicTeamTeamUrlRoute extends Route {
  @service channelService;

  afterModel(model, transition) {
    const channelService = this.channelService;
    const teamId = model.id;

    channelService.connect().then(() => {
      return channelService.joinChannel(`team:${teamId}`);
    }).then((channel) => {
      channel.on("new_member", (payload) => {
        this.store.queryRecord('member', {
          filter: {
            team: payload.team,
            member: payload.member
          },
        }).then(member => {
          model.members.pushObject(member);
        });
      });

      channel.on("update_member", (payload) => {
        this.store.queryRecord('member', {
          filter: {
            team: payload.team,
            member: payload.member
          },
        })
      });

      channel.on("remove_member", (payload) => {
        const m = model.members.findBy('id', payload.member.toString());
        model.members.removeObject(m);
      });
    });
  }

  model(params) {
    return this.store.queryRecord('team', {
      filter: {
        share_id: params.share_id
      },
      include: 'members'
    });
  }
}
