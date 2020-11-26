import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SharedTeamHeaderComponent extends Component {
  @service session;
  @service media;

  get membersLength() {
    return this.args.members.length - 1;
  }
}
