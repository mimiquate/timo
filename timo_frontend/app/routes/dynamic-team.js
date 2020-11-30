import Route from '@ember/routing/route';

export default class DynamicTeamRoute extends Route {

  model(params, transition) {
    const name = transition.to.queryParams.name;
    const p = Object.entries(transition.to.queryParams);
    const timezones = p.splice(0, p.length - 1)

    let members = [];

    timezones.forEach(([timezone, usernames]) => {
      usernames.forEach(name => {
        members.push({
          timezone,
          name
        });
      });
    });

    return {
      members,
      name
    }
  }
}
