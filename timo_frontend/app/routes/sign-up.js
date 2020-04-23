import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'landing',

  resetController(controller) {
    controller.setProperties({
      username: '',
      password: '',
      confirmPassword: '',
      errorResponse: false,
      email: ''
    });
  }
});