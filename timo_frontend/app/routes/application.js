import Route from '@ember/routing/route';
import { isEmpty } from '@ember/utils';

export default class ApplicationRoute extends Route {
  async beforeModel() {
    if (isEmpty(this.currentUser.user)) {
      this.currentUser.load();
    }
  }
}