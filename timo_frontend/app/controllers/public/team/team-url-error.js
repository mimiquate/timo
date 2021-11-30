import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TeamUrlErrorController extends Controller {
  @service session;
  @service media;
  @service router;

  @action
  transitionToLogin() {
    this.router.transitionTo('/login');
  }

  @action
  transitionToSignUp() {
    this.router.transitionTo('/sign-up');
  }
}
