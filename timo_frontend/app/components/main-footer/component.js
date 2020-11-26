import Component from "@glimmer/component";
import ENV from 'timo-frontend/config/environment';

export default class MainFooterComponent extends Component {
  get demoShareId() {
    return ENV.demoShareId;
  }
}
