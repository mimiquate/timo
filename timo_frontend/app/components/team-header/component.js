import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TeamHeaderComponent extends Component {
  @service media;

  get membersLength() {
    return this.args.members.length - 1;
  }
}
