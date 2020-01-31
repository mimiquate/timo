import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Route.extend({
  session: service(),

  async beforeModel() {
    if (isEmpty(this.session.currentUser)) {
      const user = await this.store.queryRecord('user', { me: true })
        .catch(() => null);

      this.session.setCurrentUser(user);
    }
  }
});