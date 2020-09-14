import Component from "@glimmer/component";
import { tracked } from '@glimmer/tracking';
import { action, set } from '@ember/object';
import { isPresent } from '@ember/utils';

export default class NewTeamModalComponent extends Component {
  @tracked team = '';
  @tracked teamError = '';

  @action
  cleanError(error) {
    set(this, error, '');
  }

  @action
  addTeam() {
    if (isPresent(this.team)) {
      this.args.saveTeam(this.team);
      this.args.closeModal();
    } else {
      this.teamError = `Team's name can't be blank`
    }
  }
}
