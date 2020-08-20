import Component from '@glimmer/component';
import { computed, action } from '@ember/object';

export default class ShareMenuComponent extends Component {
  @computed('group.members.[]')
  get membersLabel() {
    const members = this.args.group.members.length;

    return members > 1 ? `${members} Members` : `${members} Member`
  }

  @computed('group.members.[]')
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
