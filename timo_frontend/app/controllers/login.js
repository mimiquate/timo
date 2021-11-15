import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import { loginValidator } from 'timo-frontend/validators/user';
import lookupValidator from 'ember-changeset-validations';
import { showErrors, cleanErrors } from 'timo-frontend/utils/errors-handler'

export default class LoginController extends Controller {
  @service session;
  @service media;

  @tracked username = '';
  @tracked password = '';
  @tracked passwordError = '';
  @tracked usernameError = '';
  @tracked errorMessage = '';

  @action
  cleanError(error) {
    set(this, error, '');
  }

  @action
  async logIn(e) {
    e.preventDefault();

    const errors = ['errorMessage', 'usernameError', 'passwordError'];
    cleanErrors.call(this, errors);

    const username = this.username.trim();
    const password = this.password.trim();

    let changeset = Changeset({
      username,
      password
    }, lookupValidator(loginValidator()), loginValidator());

    await changeset.validate();

    if (changeset.isValid) {
      await this.session.authenticate('authenticator:credentials', username, password)
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
      showErrors.call(this, changeset.errors);
    }
  }
}
