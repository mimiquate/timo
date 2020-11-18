import Component from "@glimmer/component";
import { action } from '@ember/object';

export default class TInputComponent extends Component {
  @action
  onChange(event) {
    this.args.cleanError();
    this.args.onChange(event.target.value);
  }
}
