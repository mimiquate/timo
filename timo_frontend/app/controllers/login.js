import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default class LoginController extends Controller {
  @service session;

  @tracked errorResponse = false;
  @tracked username = '';
  emptyInputValidation = emptyInput;

  @action
  async getIn() {
    let { username, password } = this;
    let newUsername = username.trim();

    this.username = newUsername;
    this.errorResponse = false;

    await this.session.authenticate('authenticator:credentials', newUsername, password)
      .then(() => this.currentUser.load())
      .then(() => this.transitionToRoute('landing'))
      .catch((error) => {
        if (error.errors[0].title === "Email not verified") {
          this.transitionToRoute('verification');
        } else {
          this.errorResponse = true;
        }
      });
  }
}