import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function () {
  this.route('landing', { path: '' }, function () {
    this.route('teams', function () {
      this.route('team', { path: ':id' }, function () {});
      this.route('new');
    });
  });
  this.route('login');
});

export default Router;