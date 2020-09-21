import Component from "@glimmer/component";
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class MemberModalComponent extends Component {
  @tracked showDeleteConfirmation = false;

  rules({ newItems }) {
    if (newItems[0]) {
      return toLeft;
    } else {
      return toRight;
    }
  }

  @action
  toggleDeleteConfirmation() {
    this.showDeleteConfirmation = !this.showDeleteConfirmation;
  }
}
