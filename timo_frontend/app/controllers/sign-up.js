import Controller from '@ember/controller';
import { set } from "@ember/object";
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default Controller.extend({
  init() {
    this._super(...arguments);
    set(this, 'confirmPasswordValidation', [{
      message: 'Passwords don\'t match',
      validate: (inputValue) => inputValue === this.password
    }]);
    set(this, 'emptyInputValidation', emptyInput);
  },

  actions: {
    async signUp() {
      let { username, password, email } = this;
      let newUsername = username.trim();
      let newPassword = password.trim();
      let newEmail = email.trim();

      set(this, 'username', newUsername);
      set(this, 'password', newPassword);
      set(this, 'confirmPassword', newPassword);
      set(this, 'errorResponse', false);
      set(this, 'email', newEmail);

      let user = this.store.createRecord('user',
        {
          username: newUsername,
          password: newPassword,
          email: newEmail
        });

      await user.save()
        .then(() => this.transitionToRoute('verification'))
        .catch(() => set(this, 'errorResponse', true));
    }
  }
});