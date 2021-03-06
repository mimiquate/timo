import { module, test } from 'qunit';
import { click, fillIn, findAll, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { chooseCity } from 'timo-frontend/tests/helpers/custom-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';

module('Mobile | Acceptance | New member', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const user = this.server.create('user', { username: 'juan' });
    this.server.create('team', { id: 1, name: 'Team', user });
    this.server.create('city', {
      name: 'Montevideo',
      country: 'Uruguay',
      timezone: 'America/Montevideo'
    });
    this.server.create('city', {
      name: 'Rome',
      country: 'Italy',
      timezone: 'Europe/Rome'
    });

    const currentUser = this.owner.lookup('service:current-user');
    currentUser.setCurrentUser(user);
    authenticateSession();

    setBreakpoint('mobile');
  });

  test('Creates member in current timezone and closes modal', async function (assert) {
    await visit('/teams/1');
    await click('.team-header__mobile-tooltip-actions');

    const actions = findAll('.header-tooltip__item');

    await click(actions[1]);
    await fillIn('.t-input input', 'Member');
    await chooseCity('Montevideo');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 1, 'List has one row');
    assert.ok(timezoneRowLocations[0].textContent.includes('Montevideo, Uruguay'));
    assert.ok(timezoneRowLocations[0].textContent.includes('(Current location)'));

    const timezoneRowMembers = find('.timezone-list__members');

    assert.ok(
      timezoneRowMembers.textContent.includes('Member'),
      'Correct row members'
    );
  });

  test('Creates member and closes modal', async function (assert) {
    await visit('/teams/1');
    await click('.team-header__mobile-tooltip-actions');

    const actions = findAll('.header-tooltip__item');

    await click(actions[1]);
    await fillIn('.t-input input', 'Member');
    await chooseCity('Rome');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 2, 'List has two rows');
    assert.equal(
      timezoneRowLocations[0].textContent.trim(),
      'Current location',
      'Correct first location'
    );
    assert.equal(
      timezoneRowLocations[1].textContent.trim(),
      'Rome, Italy',
      'Correct second location'
    );

    const timezoneRowMembers = findAll('.timezone-list__members');

    assert.ok(
      timezoneRowMembers[0].textContent.includes('You'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowMembers[1].textContent.includes('Member'),
      'Correct second row members'
    );
  });

  test('Creates member with city and closes modal', async function (assert) {
    await visit('/teams/1');
    await click('.team-header__mobile-tooltip-actions');

    const actions = findAll('.header-tooltip__item');

    await click(actions[1]);
    await fillIn('.t-input input', 'Member');
    await chooseCity('Rome');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 2, 'List has two rows');
    assert.equal(
      timezoneRowLocations[0].textContent.trim(),
      'Current location',
      'Correct first location'
    );
    assert.equal(
      timezoneRowLocations[1].textContent.trim(),
      'Rome, Italy',
      'Correct second location'
    );

    const timezoneRowMembers = findAll('.timezone-list__members');

    assert.ok(
      timezoneRowMembers[0].textContent.includes('You'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowMembers[1].textContent.includes('Member'),
      'Correct second row members'
    );
  });

  test('User can see errors', async function (assert) {
    await visit('/teams/1');
    await click('.team-header__mobile-tooltip-actions');

    const actions = findAll('.header-tooltip__item');

    await click(actions[1]);
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');

    assert.dom('.t-modal').exists('Stays in new member modal');
    assert.ok(errorMessage.textContent.includes(`Name can't be blank`));
  });
});
