import Component from "@glimmer/component";

export default class TButtonComponent extends Component {
  get buttonType() {
    return this.args.buttonType || "button";
  }
}
