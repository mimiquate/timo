import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Changeset } from 'ember-changeset';
import { signUpValidator } from 'timo-frontend/validators/user';
import lookupValidator from 'ember-changeset-validations';
import { inject as service } from '@ember/service';
import { showErrors, cleanErrors } from 'timo-frontend/utils/errors-handler'

export default class SignUpController extends Controller {
  @service media;
  @service store;

  @tracked username = '';
  @tracked email = '';
  @tracked password = '';
  @tracked passwordConfirmation = '';
  @tracked passwordError = '';
  @tracked usernameError = '';
  @tracked passwordConfirmationError = '';
  @tracked emailError = '';
  @tracked errorMessage = '';
  @tracked showEmailVerificationModal = false;

  cleanInputs() {
    this.password = '';
    this.username = '';
    this.passwordConfirmation = '';
    this.email = '';
  }

  @action
  cleanError(error) {
    set(this, error, '');
  }

  @action
  closeEmailVerificationModal() {
    this.showEmailVerificationModal = false;
  }

  @action
  async signUp(e) {
    e.preventDefault();

    const errors = ['passwordError', 'usernameError', 'passwordConfirmationError', 'emailError'];
    cleanErrors.call(this, errors);

    const username = this.username.trim();
    const email = this.email.trim();
    const password = this.password.trim();
    const passwordConfirmation = this.passwordConfirmation.trim();

    const user = {
      username,
      email,
      password,
      passwordConfirmation
    }

    let changeset = Changeset(user, lookupValidator(signUpValidator()), signUpValidator());

    await changeset.validate();

    if (changeset.isValid) {
      const user = this.store.createRecord('user', {
        username,
        password,
        email
      });

      await user.save()
        .then(() => {
          this.showEmailVerificationModal = true;
          cleanErrors.call(this, errors);
          this.cleanInputs();
        })
        .catch(() => this.errorMessage = 'That username is already taken');
    } else {
      showErrors.call(this, changeset.errors);
    }
  }
}
