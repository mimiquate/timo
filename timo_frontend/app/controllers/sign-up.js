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
      set(this, 'confirmPassword', newPassword);
      set(this, 'errorResponse', false);

      if (isPresent(newUsername) && isPresent(newPassword)) {
        let user = this.store.createRecord('user', { username: newUsername, password: newPassword });

        await user.save()
          .then(() => this.transitionToRoute('login') )
          .catch(() => set(this, 'errorResponse', true) );
      }
    }
  }
});