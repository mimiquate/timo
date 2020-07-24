import Controller from '@ember/controller';
import { set, action } from '@ember/object';
import { inject as service } from '@ember/service';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default Controller.extend({
  init() {
    this._super(...arguments);
    set(this, 'emptyInputValidation', emptyInput);
  },

  session: service(),

  errorResponse: false,

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
});