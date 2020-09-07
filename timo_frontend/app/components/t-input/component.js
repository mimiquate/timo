import Component from "@glimmer/component";
import { action } from '@ember/object';

export default class TInputComponent extends Component {
  @action
  onChange(e) {
    this.args.onChange(e.target.value);
  }
}
