import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  session: service(),

  actions: {
    async getIn() {
      let { username } = this;
      let newUsername = username.trim();

      this.set("username", newUsername);

      if (newUsername) {
        let user = this.store.createRecord('user', { username: newUsername });
        await user.save();
        await this.router.transitionTo('landing');
      }
    },

    setValue(value) {
      this.set('username', value);
    }
  }
});