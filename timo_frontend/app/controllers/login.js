import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import { loginValidator } from 'timo-frontend/validators/user';
import lookupValidator from 'ember-changeset-validations';

export default class LoginController extends Controller {
  @service session;
  @service media;

  @tracked username = '';
  @tracked password = '';
  @tracked passwordError = '';
  @tracked usernameError = '';
  @tracked errorMessage = '';

  showErrors(errors) {
    errors.forEach(field => {
      set(this, `${field.key}Error`, field.validation[0]);
    });
  }

  cleanErrors() {
    this.errorMessage = '';
    this.usernameError = '';
    this.passwordError = '';
  }

  @action
  cleanError(error) {
    set(this, error, '');
  }

  @action
  async logIn(e) {
    e.preventDefault();
    this.cleanErrors();

    const username = this.username.trim();
    const password = this.password.trim();

    let changeset = Changeset({
      username,
      password
    }, lookupValidator(loginValidator()), loginValidator());

    await changeset.validate();

    if (changeset.isValid) {
      await this.session.authenticate('authenticator:credentials', username, password)
        .then(() => this.currentUser.load())
        .then(() => this.transitionToRoute('landing'))
        .catch((error) => {
          // Defensive code to ignore TransitionAborted error
          if (error.errors) {
            if (error.errors[0].title === "Email not verified") {
              this.errorMessage = 'Please check your email and verify your account';
            } else {
              this.errorMessage = error.errors[0].title;
            }
          }
        });
    } else {
      this.showErrors(changeset.errors);
    }
  }
}
