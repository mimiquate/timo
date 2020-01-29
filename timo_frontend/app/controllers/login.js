import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from "@ember/object";

export default Controller.extend({
  session: service(),

  actions: {
    async getIn() {
      let { username } = this;
      let newUsername = username.trim();

      set(this, 'username', newUsername);

      if (newUsername) {
        let user = this.store.createRecord('user', { username: newUsername });

        user = await user.save();
        this.session.setCurrentUser(user);

        await this.transitionToRoute('landing');
      }
    },

    setValue(value) {
      set(this, 'username', value);
    }
  }
});