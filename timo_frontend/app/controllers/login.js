import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';
import { isEmpty, isPresent } from '@ember/utils';

export default class LoginController extends Controller {
  @service session;
  @tracked errorResponse = false;
  @tracked username = '';
  @tracked password = '';
  @tracked passwordError = '';
  @tracked usernameError = '';
  @tracked errorMessage = '';
  emptyInputValidation = emptyInput;

  validate() {
    [
      { value: this.username, error: 'usernameError' },
      { value: this.password, error: 'passwordError' }
    ].forEach(field => {
      isEmpty(field.value) ? set(this, field.error, true) : set(this, field.error, false);
    });

    return !this.usernameError && !this.passwordError;
  }

  @action
  async logIn() {
    this.errorMessage = '';

    const username = this.username.trim();
    const password = this.password.trim();

    const isValid = this.validate();

    if (isValid) {
      await this.session.authenticate('authenticator:credentials', username, password)
        .then(() => this.currentUser.load())
        .then(() => this.transitionToRoute('landing'))
        .catch((error) => {
          if (error.errors[0].title === "Email not verified") {
            this.transitionToRoute('verification');
          } else {
            this.errorMessage = error.errors[0].title;
          }
        });
    }
  }
}
