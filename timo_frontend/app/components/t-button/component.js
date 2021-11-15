import Component from "@glimmer/component";
import { action, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default class TButtonComponent extends Component {
  get buttonType() {
    return this.args.buttonType || "button";
  }

  @action
  onClick() {
    if (isPresent(get(this.args, 'onClick'))) {
      this.args.onClick()
    }
  }
}
