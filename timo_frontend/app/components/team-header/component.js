import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TeamHeaderComponent extends Component {
  @service media;

  get membersLabel() {
    const members = this.args.members.length;

    return members > 1 ? `${members} Members` : `${members} Member`
  }
}
