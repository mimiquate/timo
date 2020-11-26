import { module, test } from 'qunit';
import { visit, click, currentURL, findAll, find } from '@ember/test-helpers';
import { loginAs, invalidUserServerPost } from 'timo-frontend/tests/helpers/custom-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';

module('Mobile | Acceptance | Login', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    setBreakpoint('mobile');
  });

  test('Successful login', async function (assert) {
    const user = this.server.create('user', { username: 'juan', password: 'password' });
    this.server.get('/users/me', user, 200);

    await visit('/login');
    await loginAs('juan', 'password');

    assert.equal(currentURL(), '/');
    assert.dom('[data-test=log-out]').hasText('Log out');
    assert.dom('[data-test=landing-image]').exists();
  });

  test('Login with no username and password', async function (assert) {
    await visit('/login');
    await loginAs('', '');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/login', 'Stays in login page');
    assert.ok(
      errorMessage[0].textContent.includes(`Username can't be blank`),
      'No username error'
    );
    assert.ok(
      errorMessage[1].textContent.includes(`Password can't be blank`),
      'No password error'
    );
  });

  test('Login with wrong username error', async function (assert) {
    this.server.create('user', { username: 'juan', password: 'password' });
    invalidUserServerPost.call(this);

    await visit('/login');
    await loginAs('marcelo', 'password');

    assert.equal(currentURL(), '/login', 'Stays in login page after unsuccessful login');
    assert.dom('.response-error')
      .hasText('Invalid username or password', 'Wrong username');
  });

  test('Login with wrong password error', async function (assert) {
    this.server.create('user', { username: 'juan', password: 'password' });
    invalidUserServerPost.call(this);

    await visit('/login');
    await loginAs('juan', 'wrong_password');

    assert.equal(currentURL(), '/login', 'Stays in login page after unsuccessful login');
    assert.dom('.response-error')
      .hasText('Invalid username or password', 'Wrong password');
  });

  test('Click sign-up link', async function (assert) {
    await visit('/login');
    await click('[data-test=sign-up-link]');

    assert.equal(currentURL(), '/sign-up', 'Visits sign up page');
  })

  test('Unverified login', async function (assert) {
    this.server.create('user', { username: 'juan', password: 'password' });
    this.server.post(
      '/session',
      {
        errors: [{
          detail: 'Email must be verified to access account',
          status: '400',
          title: 'Email not verified'
        }]
      },
      400
    );

    await visit('/login');
    await loginAs('juan', 'password');

    assert.equal(currentURL(), '/login', 'Show verification message');
    assert.dom('.response-error')
      .hasText('Please check your email and verify your account', 'Wrong password');
  });

  test('Clicks demo link', async function (assert) {
    server.get('/teams', function (schema, request) {
      const share_id = request.queryParams['filter[share_id]'];
      const team = schema.teams.findBy({
        share_id,
        public: true
      });

      return team;
    }, 200);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit('/login');
    await click('[data-test-footer=demo]');

    assert.equal(currentURL(), `/p/team/${team.share_id}`, 'Correct demo link');
    assert.dom('[data-test=team-title]').exists('New team title page loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const timezoneDivs = findAll('.timezone-list__row');
    assert.equal(timezoneDivs.length, 1, 'Has only one timezone, the one from the user');

    const timezoneLocation = find('.timezone-list__location');
    assert.equal(
      timezoneLocation.textContent.trim(),
      'America, Montevideo',
      'Correct location'
    );
  });
});
