import Component from '@glimmer/component';

export default class ShareMenuComponent extends Component {

  get membersLabel() {
    const members = this.args.group.members.length;

    return members > 1 ? `${members} Members` : `${members} Member`
  }

  get timezonesLabel() {
    const members = this.args.group.members;
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

    return t.length > 1 ? `${t.length} Timezones` : `${t.length} Timezone`
  }
}
