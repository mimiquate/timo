import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @service store;
  @service session;
  @service router;

  @tracked user = null;

  setCurrentUser(user) {
    this.user = user;
  }

  async logOut() {
    const adapter = await this.store.adapterFor('user');
    await adapter.deleteSession();
    this.user = null;
  }

  async load() {
    if (this.session.isAuthenticated && !this.user) {
      const user = await this.store.queryRecord('user', { me: true })
        .catch(() => {
          this.session.invalidate();
          this.store.unloadAll();
          this.router.transitionTo('login');
        });

      this.user = user;
    }
  }
}
