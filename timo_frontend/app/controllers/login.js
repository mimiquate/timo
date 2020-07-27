import Controller from '@ember/controller';
import { set, action } from '@ember/object';
import { inject as service } from '@ember/service';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default class LoginController extends Controller {
  constructor() {
    super(...arguments);
    set(this, 'emptyInputValidation', emptyInput);
  }

  @service session;

  errorResponse = false;

  @action
  async getIn() {
    let { username, password } = this;
    let newUsername = username.trim();

    set(this, 'username', newUsername);
    set(this, 'errorResponse', false);

    await this.session.authenticate('authenticator:credentials', newUsername, password)
      .then(() => this.currentUser.load())
      .then(() => this.transitionToRoute('landing'))
      .catch((error) => {
        if (error.errors[0].title === "Email not verified") {
          this.transitionToRoute('verification');
        } else {
          set(this, 'errorResponse', true);
        }
      });
  }
}