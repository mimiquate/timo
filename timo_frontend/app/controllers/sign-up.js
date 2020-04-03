import Controller from '@ember/controller';
import { set } from "@ember/object";
import { isPresent } from '@ember/utils';

export default Controller.extend({
  init() {
    this._super(...arguments);
    set(this, 'confirmPasswordValidation', [{
      message: 'Passwords don\'t match',
      validate: (inputValue) => inputValue === this.password
    }]);
  },

  actions: {
    async signUp() {
      let { username, password } = this;
      let newUsername = username.trim();
      let newPassword = password.trim();

      set(this, 'username', newUsername);
      set(this, 'password', newPassword);
      set(this, 'confirm', newPassword);

      if (isPresent(newUsername) && isPresent(newPassword)) {
        let user = this.store.createRecord('user', { username: newUsername, password: newPassword });

        user = await user.save()
          .catch(() => {
            return null;
          });

        if (user) {
          await this.transitionToRoute('login');
        }
      }
    }
  }
});