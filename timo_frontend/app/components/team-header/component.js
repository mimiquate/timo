import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TeamHeaderComponent extends Component {
  @service media;
  @tracked showTeamOptions = false;

  get membersLabel() {
    const members = this.args.members.length;

    return members > 1 ? `${members} Members` : `${members} Member`
  }

  @action
  openTeamOptions() {
    this.showTeamOptions = true;
  }

  closeTeamOptions() {
    this.showTeamOptions = false;
  }
}
