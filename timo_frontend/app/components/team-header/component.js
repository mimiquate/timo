import Component from '@glimmer/component';

export default class TeamHeaderComponent extends Component {
  get membersLabel() {
    const members = this.args.team.members.length;

    return members > 1 ? `Members ${members}` : `Member ${members}`
  }

  get timezonesLabel() {
    const members = this.args.team.members;
    const timezones = members.map(m => {
      return m.timezone
    });

    let t = [];
    timezones.forEach(timezone => {
      const exists = t.find(t => t === timezone);
      if (!exists) {
        t.pushObject(timezone);
      }
    })

    return t.length > 1 ? `Timezones ${t.length}` : `Timezone ${t.length}`;
  }
}
