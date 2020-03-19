import Service from '@ember/service';
import { set } from "@ember/object";
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),
  currentUser: null,

  setCurrentUser(user) {
    set(this, 'currentUser', user);
  },

  async logOut() {
    const adapter = await this.store.adapterFor('user');
    await adapter.deleteSession();
    set(this, 'currentUser', null);
  }
});