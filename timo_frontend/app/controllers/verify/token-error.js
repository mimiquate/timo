import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TokenErrorController extends Controller {
  @service session;
  @service media;

  @action
  transitionToLogin() {
    this.transitionToRoute('/login');
  }

  @action
  transitionToSignUp() {
    this.transitionToRoute('/sign-up');
  }
}
