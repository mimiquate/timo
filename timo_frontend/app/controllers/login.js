import Controller from '@ember/controller';
import { set } from "@ember/object";
import { isPresent } from '@ember/utils';

export default Controller.extend({
  actions: {
    async getIn() {
      let { username } = this;
      let newUsername = username.trim();

      set(this, 'username', newUsername);

      if (isPresent(newUsername)) {
        let user = this.store.createRecord('user', { username: newUsername });

        await user.save();
        this.currentUser.setCurrentUser(user);

        await this.transitionToRoute('landing');
      }
    }
  }
});