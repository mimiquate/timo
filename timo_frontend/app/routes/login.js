import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.prohibitAuthentication('landing');
  }

  resetController(controller) {
    controller.setProperties({
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      errorMessage: ''
    });
  }
}
