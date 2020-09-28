import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SharedTeamHeaderComponent extends Component {
  @service session;

  get membersLabel() {
    const members = this.args.members.length;

    return members > 1 ? `Members ${members}` : `Member ${members}`
  }

  get timezonesLabel() {
    const members = this.args.members;
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

    return t.length > 1 ? `Timezones ${t.length}` : `Timezone ${t.length}`
  }
}
