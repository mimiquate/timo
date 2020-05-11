import Service from '@ember/service';
import { set } from "@ember/object";
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),
  session: service(),
  router: service(),
  user: null,

  setCurrentUser(user) {
    set(this, 'user', user);
  },

  async logOut() {
    const adapter = await this.store.adapterFor('user');
    await adapter.deleteSession();
    set(this, 'user', null);
  },

  async load() {
    if (this.session.isAuthenticated) {
      const user = await this.store.queryRecord('user', { me: true })
        .catch(() => {
          this.session.invalidate();
          this.store.unloadAll();
          this.router.transitionTo('login');
        });

      set(this, 'user', user);
    }
  }
});