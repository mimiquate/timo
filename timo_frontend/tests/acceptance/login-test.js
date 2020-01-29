import { module, test } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
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
    this.server.get('/users/me', () => {
      return newUser;
    });

    await visit('/login');

    assert.equal(currentURL(), '/landing', 'Correctly redirects to landing page');
  });

  test('Log in with new username', async function (assert) {
    this.server.get('/users/me', (schema) => {
      return schema.users.first();
    });

    await visit('/login');
    await fillIn('#username-input input', 'juan');
    await click('[data-test-rr=login-button]');

    assert.equal(currentURL(), '/landing', 'Visits landing after creating a new user')
  });

  test('Log in with already existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    
    await visit('/login');

    this.server.get('/users/me', () => {
      return newUser;
    });

    await fillIn('#username-input input', 'juan');
    await click('[data-test-rr=login-button]');

    assert.equal(currentURL(), '/landing', 'Visits landing with already created user')
  });

  test('Login with no username error', async function (assert) {
    await visit('/login');
    await click('[data-test-rr=login-button]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), '/login', 'Stays in login page after unsuccessful login and error message appears');
    assert.ok(errorMessage[0].textContent.includes('This is required'), 'No username error');
  });

  test('Login with only whitespace username error', async function (assert) {
    await visit('/login');
    await fillIn('#username-input input', '     ');
    await click('[data-test-rr=login-button]');

    assert.equal(currentURL(), '/login', 'Stays in login page after unsuccessful login');
  });
});
