import Component from "@glimmer/component";
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';
import { Changeset } from 'ember-changeset';
import { isPresent } from '@ember/utils';

export default class EditTeamModalComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    this.teamChangeset = Changeset(this.args.team);
  }

  @tracked nameError = '';
  @tracked showDeleteConfirmation = false;

  rules({ newItems }) {
    if (newItems[0]) {
      return toLeft;
    } else {
      return toRight;
    }
  }

  @action
  cleanError() {
    this.nameError = '';
  }

  @action
  toggleDeleteConfirmation() {
    this.showDeleteConfirmation = !this.showDeleteConfirmation;
  }

  @action
  updateTeam(event) {
    event.preventDefault();
    this.cleanError();
    const team = this.teamChangeset;

    if (isPresent(team.name)) {
      team.save();
      this.args.closeModal();
    } else {
      this.nameError = `Name can't be blank`;
    }
  }
}
