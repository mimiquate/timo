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
  this.route('public', { path: 'p' }, function () {
    this.route('team', function () {
      this.route('team-url', { path: ':share_id' });
    })
  })
  this.route('login');
  this.route('sign-up');
});

export default Router;