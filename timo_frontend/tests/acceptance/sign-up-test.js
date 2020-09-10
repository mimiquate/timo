import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setSession, signUp } from 'timo-frontend/tests/helpers/custom-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | Sign-up', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /sign-up', async function (assert) {
    await visit('/sign-up');

    assert.equal(currentURL(), '/sign-up', 'Correctly visits sign up page');
  });

  test('Visiting /sign-up with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/sign-up');

    assert.equal(currentURL(), '/', 'Correctly redirects to landing page');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
  });

  test('Click login link', async function (assert) {
    await visit('/sign-up');
    await click('[data-test=login-link]');

    assert.equal(currentURL(), '/login', 'Visits login page');
  });

  test('Successful sign up', async function (assert) {
    await visit('/sign-up');
    await signUp('juan', 'password', 'password', 'email@timo.com');

    const user = this.server.db.users.findBy({ username: 'juan'});

    assert.dom('.verify-email-modal').exists();
    assert.notEqual(user, null, 'New user is created');
  });

  test('Unsuccessful sign up with existing user', async function (assert) {
    this.server.create('user', { username: 'juan' });
    this.server.post('/users', { errors: {username:['has already been taken']} }, 422);

    await visit('/sign-up');
    await signUp('juan', 'password', 'password', 'email@timo.com');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.dom('.response-error')
      .hasText('That username is already taken', 'Username already taken');
  });

  test('Unsuccessful sign up with existing user with whitespace', async function (assert) {
    this.server.create('user', { username: 'juan' });
    this.server.post('/users', { errors: {username:['has already been taken']} }, 422);

    await visit('/sign-up');
    await signUp('juan   ', 'password', 'password', 'email@timo.com');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.dom('.response-error')
      .hasText('That username is already taken', 'Username already taken');
  });

  test('Sign up with no username error', async function (assert) {
    await visit('/sign-up');
    await signUp('', 'password', 'password', 'email@timo.com');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Username can't be blank`),
      'No username error'
    );
  });

  test('Sign up with no password error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', '', 'password', 'email@timo.com');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Password can't be blank`),
      'No password error'
    );
  });

  test('Sign up with no confirmation error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', 'password', '', 'email@timo.com');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Password confirmation can't be blank`),
      'No confirmation error'
    );
  });

  test('Sign up with username less than 4 length error', async function (assert) {
    await visit('/sign-up');
    await signUp('123', 'password', 'password', 'email@timo.com');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page after all attempts');
    assert.ok(
      errorMessage[0].textContent.includes('Username must have at least 4 characters'),
      'Username length error'
    );
  });

  test('Sign up with password less than 8 length error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', '1234567', '1234567', 'email@timo.com');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes('Password must have at least 8 characters'),
      'Password length error'
    );
  });

  test('Sign up without matching password confirmation', async function (assert) {
    await visit('/sign-up');
    await signUp('username', 'password', 'password2', 'email@timo.com');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Password confirmation doesn't match`),
      'Passwords don\'t match error'
    );
  });

  test('Sign up with username all whitespace', async function (assert) {
    await visit('/sign-up');
    await signUp('    ', 'password', 'password', 'email@timo.com');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Username can't be blank`),
      'No username error'
    );
  });

  test('Sign up with password all whitespace', async function (assert) {
    await visit('/sign-up');
    await signUp('username', '        ', '        ', 'email@timo.com');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');

    assert.ok(errorMessage[0].textContent.includes(`Password can't be blank`));
    assert.ok(errorMessage[1].textContent.includes(`Password confirmation can't be blank`));
  });

  test('Sign up with no email error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', 'password', 'password', '');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Email can't be blank`),
      'No email error'
    );
  });

  test('Sign up with email all whitespace error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', 'password', 'password', '     ');

    let errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Email can't be blank`),
      'No email error'
    );
  });

  test('Sign up with wrong email format error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', 'password', 'password', 'email');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');

    await signUp('username', 'password', 'password', 'email@');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
  });
});
