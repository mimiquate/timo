import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class ApplicationRoute extends Route {
  @service metrics
  @service router
  @service currentUser;

  constructor() {
    super(...arguments);

    const router = this.router;
    router.on('routeDidChange', () => {
      const page = router.currentURL;
      const title = router.currentRouteName || 'unknown';

      this.metrics.trackPage({ page, title });
    });
  }

  async beforeModel() {
    if (isEmpty(this.currentUser.user)) {
      this.currentUser.load();
    }
  }
}
