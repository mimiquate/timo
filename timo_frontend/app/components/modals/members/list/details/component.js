import Component from "@glimmer/component";
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { toLeft, toRight } from 'ember-animated/transitions/move-over';

export default class DetailsMemberComponent extends Component {
  @tracked showDeleteConfirmation = false;

  rules({ newItems }) {
    if (newItems[0]) {
      return toLeft;
    } else {
      return toRight;
    }
  }

  @action
  openDeleteConfirmation() {
    this.showDeleteConfirmation = true;
  }

  @action
  closeDeleteConfirmation() {
    this.showDeleteConfirmation = false;
  }
}
