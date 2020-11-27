import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  find,
  click,
  findAll
} from '@ember/test-helpers';
import { signUp } from 'timo-frontend/tests/helpers/custom-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';

module('Mobile | Acceptance | Sign-up', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    setBreakpoint('mobile');
  });

  test('Successful sign up', async function (assert) {
    await visit('/sign-up');
    await signUp('juan', 'password', 'password', 'email@timo.com');

    const user = this.server.db.users.findBy({ username: 'juan'});

    assert.dom('.verify-email-modal').exists();
    assert.equal(
      find('.verify-email-modal__title').textContent.trim(),
      'Check your email'
    );
    assert.equal(
      find('.verify-email-modal__description').textContent.trim(),
      'Please check out your email and verify your account.'
    );
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

  test('Sign up with no username error', async function (assert) {
    await visit('/sign-up');
    await signUp('', 'password', 'password', 'email@timo.com');

    const errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Username can't be blank`),
      'No username error'
    );
  });

  test('Sign up with no password error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', '', 'password', 'email@timo.com');

    const errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Password can't be blank`),
      'No password error'
    );
  });

  test('Sign up with no confirmation error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', 'password', '', 'email@timo.com');

    const errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Password confirmation can't be blank`),
      'No confirmation error'
    );
  });

  test('Sign up with username less than 4 length error', async function (assert) {
    await visit('/sign-up');
    await signUp('123', 'password', 'password', 'email@timo.com');

    const errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page after all attempts');
    assert.ok(
      errorMessage[0].textContent.includes('Username must have at least 4 characters'),
      'Username length error'
    );
  });

  test('Sign up with password less than 8 length error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', '1234567', '1234567', 'email@timo.com');

    const errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes('Password must have at least 8 characters'),
      'Password length error'
    );
  });

  test('Sign up without matching password confirmation', async function (assert) {
    await visit('/sign-up');
    await signUp('username', 'password', 'password2', 'email@timo.com');

    const errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Password confirmation doesn't match`),
      'Passwords don\'t match error'
    );
  });

  test('Sign up with username all whitespace', async function (assert) {
    await visit('/sign-up');
    await signUp('    ', 'password', 'password', 'email@timo.com');

    const errorMessage = this.element.querySelectorAll('.t-input__error');

    assert.equal(currentURL(), '/sign-up', 'Stays in sign up page');
    assert.ok(
      errorMessage[0].textContent.includes(`Username can't be blank`),
      'No username error'
    );
  });

  test('Sign up with no email error', async function (assert) {
    await visit('/sign-up');
    await signUp('username', 'password', 'password', '');

    const errorMessage = this.element.querySelectorAll('.t-input__error');

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

  test('Clicks demo link', async function (assert) {
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
