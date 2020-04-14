import Controller from '@ember/controller';
import { set } from "@ember/object";
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),

  errorResponse: false,

  actions: {
    async getIn() {
      let { username, password } = this;
      let newUsername = username.trim();

      set(this, 'username', newUsername);
      set(this, 'errorResponse', false);

      if (isPresent(newUsername) && isPresent(password)) {
        await this.session.authenticate('authenticator:credentials', newUsername, password)
          .then(() => this.currentUser.load() )
          .then(() => this.transitionToRoute('landing') )
          .catch(() => set(this, 'errorResponse', true) );
      }
    }
  }
});