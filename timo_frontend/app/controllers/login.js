import Controller from '@ember/controller';
import { set } from "@ember/object";
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  actions: {
    async getIn() {
      let { username, password } = this;
      let newUsername = username.trim();

      set(this, 'username', newUsername);

      if (isPresent(newUsername) && isPresent(password)) {
        await this.session.authenticate('authenticator:credentials', newUsername, password);
        await this.transitionToRoute('landing');
        this.currentUser.load();
      }
    }
  }
});