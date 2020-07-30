import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default class SignUpController extends Controller {
  @tracked username = '';
  @tracked password = '';
  @tracked confirmPassword = '';
  @tracked email = '';
  @tracked errorResponse = false;
  emptyInputValidation = emptyInput;
  confirmPasswordValidation = [{
    message: 'Passwords don\'t match',
    validate: (inputValue) => inputValue === this.password
  }];

  @action
  async signUp() {
    let { username, password, email } = this;
    let newUsername = username.trim();
    let newPassword = password.trim();
    let newEmail = email.trim();

    this.username = newUsername;
    this.password = newPassword;
    this.confirmPassword = newPassword;
    this.errorResponse = false;
    this.email = newEmail;

    let user = this.store.createRecord('user',
      {
        username: newUsername,
        password: newPassword,
        email: newEmail
      });

    await user.save()
      .then(() => this.transitionToRoute('verification'))
      .catch(() => this.errorResponse = true);
  }
}