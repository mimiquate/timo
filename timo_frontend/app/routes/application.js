import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  async beforeModel() {
    const user = await this.store.queryRecord('user', { me: true })
      .catch(() => null);

    this.session.setCurrentUser(user);
  }
});