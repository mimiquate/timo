import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { loginAs, setSession, invalidUserServerPost } from '../helpers/custom-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | Login', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /login', async function (assert) {
    await visit('/login');

    assert.equal(currentURL(), '/login', 'Correctly visits login page');
  });

  test('Visiting /login with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/login');

    assert.equal(currentURL(), '/', 'Correctly redirects to landing page');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
  });

  test('Successful login', async function (assert) {
    const user = this.server.create('user', { username: 'juan', password: 'password'});
    this.server.get('/users/me', user, 200);

    await visit('/login');
    await loginAs('juan', 'password');

    assert.equal(currentURL(), '/', 'Correctly goes to landing page');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
  });

  test('Login with no username error', async function (assert) {
    await visit('/login');
    await loginAs('', 'password');
    await click('[data-test=login-button]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), '/login', 'Stays in login page');
    assert.ok(
      errorMessage[0].textContent.includes('This is required'),
      'No username error'
    );
  });

  test('Login with only whitespace username error', async function (assert) {
    await visit('/login');
    await loginAs('     ', 'password');

    assert.equal(currentURL(), '/login', 'Stays in login page after unsuccessful login');
  });

  test('Login with no password error', async function (assert) {
    await visit('/login');
    await loginAs('juan', '');
    await click('[data-test=login-button]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), '/login', 'Stays in login page');
    assert.ok(
      errorMessage[0].textContent.includes('This is required'),
      'No password error'
    );
  });

  test('Login with wrong username error', async function (assert) {
    this.server.create('user', { username: 'juan', password: 'password'});
    invalidUserServerPost.call(this);

    await visit('/login');
    await loginAs('marcelo', 'password');

    assert.equal(currentURL(), '/login', 'Stays in login page after unsuccessful login');
    assert.dom('[data-test=login-error]')
      .hasText('Invalid username or password', 'Wrong username');
  });

  test('Login with wrong password error', async function (assert) {
    this.server.create('user', { username: 'juan', password: 'password'});
    invalidUserServerPost.call(this);

    await visit('/login');
    await loginAs('juan', 'wrong_password');

    assert.equal(currentURL(), '/login', 'Stays in login page after unsuccessful login');
    assert.dom('[data-test=login-error]')
      .hasText('Invalid username or password', 'Wrong password');
  });

  test('Click sign-up link', async function (assert) {
    await visit('/login');
    await click('[data-test=sign-up-link]');

    assert.equal(currentURL(), '/sign-up', 'Visits sign up page');
  })
});
