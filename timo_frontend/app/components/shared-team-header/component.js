import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SharedTeamHeaderComponent extends Component {
  @service session;
  @service media;

  get membersLabel() {
    const members = this.args.members.length - 1;

    if (members === 0) {
      return 'No members'
    } else if (members === 1) {
      return `${members} Member`;
    } else {
      return `${members} Members`
    }
  }
}
