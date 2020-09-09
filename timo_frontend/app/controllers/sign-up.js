import Controller from '@ember/controller';
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Changeset } from 'ember-changeset';
import { signUpValidator } from 'timo-frontend/validators/user';
import lookupValidator from 'ember-changeset-validations';

export default class SignUpController extends Controller {
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

  showErrors(errors) {
    errors.forEach(field => {
      set(this, `${field.key}Error`, field.validation[0]);
    });
  }

  cleanInputs() {
    this.password = '';
    this.username = '';
    this.passwordConfirmation = '';
    this.email = '';
  }

  cleanErrors() {
    this.passwordError = '';
    this.usernameError = '';
    this.passwordConfirmationError = '';
    this.emailError = '';
  }

  @action
  closeEmailVerificationModal() {
    this.showEmailVerificationModal = false;
  }

  @action
  async signUp() {
    this.cleanErrors();

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
          this.cleanErrors();
          this.cleanInputs();
        })
        .catch(() => this.errorMessage = 'That username is already taken');
    } else {
      this.showErrors(changeset.errors);
    }
  }
}
