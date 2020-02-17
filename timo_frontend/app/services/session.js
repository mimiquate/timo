import Service from '@ember/service';
import { set } from "@ember/object";

export default Service.extend({
  currentUser: null,

  setCurrentUser(user) {
    set(this, 'currentUser', user);
  },

  async logOut(user) {
    const adapter = await user.store.adapterFor('user');
    return adapter.deleteSession();
  }
});