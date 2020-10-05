import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SharedTeamHeaderComponent extends Component {
  @service session;

  get membersLabel() {
    const members = this.args.members.length;

    return members > 1 ? `${members} Members` : `${members} Member`;
  }
}
