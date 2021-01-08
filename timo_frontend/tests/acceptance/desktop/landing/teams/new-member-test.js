import { module, test } from 'qunit';
import { click, fillIn, findAll, find, triggerEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { chooseTimeZone, openNewMemberModal, chooseCity } from 'timo-frontend/tests/helpers/custom-helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | New member', function (hooks) {
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
  });

  test('Resets inputs when entering new member page', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', 'Member');

    await chooseTimeZone('America/Montevideo');
    await chooseCity('Montevideo');

    await click('.t-modal__close');

    await openNewMemberModal(1);

    assert.dom('.t-input input').hasText('', 'Member name input is empty');
    assert.dom('.t-dropdown').hasText('Select timezone', 'Member time zone is empty');

    const autocomplete = find('.t-autocomplete input');

    assert.equal(autocomplete.value, '', 'Member city is empty');
    assert.equal(autocomplete.placeholder, 'Search for city (optional)', 'Correct city placeholder');
  });

  test('Creates member in current timezone and closes modal', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', 'Member');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 1, 'List has one row');
    assert.equal(
      timezoneRowLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct location'
    );

    const timezoneRowMembers = find('.timezone-list__members');

    assert.ok(
      timezoneRowMembers.textContent.includes('Member (Current location)'),
      'Correct row members'
    );
  });

  test('Creates member and closes modal', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', 'Member');
    await chooseTimeZone('Europe/Rome');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 2, 'List has two rows');
    assert.equal(
      timezoneRowLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneRowLocations[1].textContent.trim(),
      'Europe, Rome',
      'Correct second location'
    );

    const timezoneRowMembers = findAll('.timezone-list__members');

    assert.ok(
      timezoneRowMembers[0].textContent.includes('Current location'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowMembers[1].textContent.includes('Member'),
      'Correct second row members'
    );
  });

  test('Creates member with city and closes modal', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', 'Member');
    await chooseCity('Rome');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 2, 'List has two rows');
    assert.equal(
      timezoneRowLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneRowLocations[1].textContent.trim(),
      'Rome, Italy',
      'Correct second location'
    );

    const timezoneRowMembers = findAll('.timezone-list__members');

    assert.ok(
      timezoneRowMembers[0].textContent.includes('Current location'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowMembers[1].textContent.includes('Member'),
      'Correct second row members'
    );
  });

  test('Creates member with city over timezone and closes modal', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', 'Member');
    await chooseTimeZone('America/Montevideo');
    await chooseCity('Rome');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 2, 'List has two rows');
    assert.equal(
      timezoneRowLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneRowLocations[1].textContent.trim(),
      'Rome, Italy',
      'Correct second location'
    );

    const timezoneRowMembers = findAll('.timezone-list__members');

    assert.ok(
      timezoneRowMembers[0].textContent.includes('Current location'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowMembers[1].textContent.includes('Member'),
      'Correct second row members'
    );
  });

  test('Creates member with timezone over city and closes modal', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', 'Member');
    await chooseCity('Montevideo');
    await chooseTimeZone('Europe/Rome');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 2, 'List has two rows');
    assert.equal(
      timezoneRowLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneRowLocations[1].textContent.trim(),
      'Europe, Rome',
      'Correct second location'
    );

    const timezoneRowMembers = findAll('.timezone-list__members');

    assert.ok(
      timezoneRowMembers[0].textContent.includes('Current location'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowMembers[1].textContent.includes('Member'),
      'Correct second row members'
    );
  });

  test('Creates member and closes modal pressing enter', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', 'Member');
    await chooseTimeZone('Europe/Rome');
    await triggerEvent('.t-form', 'submit');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowLocations = findAll('.timezone-list__location');

    assert.equal(timezoneRowLocations.length, 2, 'List has two rows');
    assert.equal(
      timezoneRowLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneRowLocations[1].textContent.trim(),
      'Europe, Rome',
      'Correct second location'
    );

    const timezoneRowMembers = findAll('.timezone-list__members');

    assert.ok(
      timezoneRowMembers[0].textContent.includes('Current location'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowMembers[1].textContent.includes('Member'),
      'Correct second row members'
    );
  });

  test('Create member with no name and no time zone error', async function (assert) {
    await openNewMemberModal(1);
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');

    assert.dom('.t-modal').exists('Stays in new member modal');
    assert.ok(errorMessage.textContent
      .includes(`Name can't be blank`), 'No member name error');
  });

  test('Create member with name but no time zone error', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', 'Member');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').exists('Stays in new member modal');
  });

  test('Create member with time zone but no name error', async function (assert) {
    await openNewMemberModal(1);
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');

    assert.dom('.t-modal').exists('Stays in new member modal');
    assert.ok(errorMessage.textContent
      .includes(`Name can't be blank`), 'No member name error');
  });

  test('Create member with time zone but with only whitespace name error', async function (assert) {
    await openNewMemberModal(1);
    await fillIn('.t-input input', '     ');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');

    assert.dom('.t-modal').exists('Stays in new member modal');
    assert.ok(errorMessage.textContent
      .includes(`Name can't be blank`), 'No member name error');
  });

  test('Timezone and city inputs depend on each other', async function (assert) {
    await openNewMemberModal(1);

    const autocomplete = find('.t-autocomplete input');

    await chooseTimeZone('Europe/Rome');

    assert.dom('.t-dropdown').hasText('Europe/Rome', 'Correct timezone');
    assert.equal(autocomplete.value, '', 'City is empty');

    await chooseCity('Montevideo');

    assert.dom('.t-dropdown').hasText('America/Montevideo', 'Timezone changes to city one');
    assert.equal(autocomplete.value, 'Montevideo, Uruguay', 'Correct city');

    await chooseTimeZone('Europe/Rome');

    assert.dom('.t-dropdown').hasText('Europe/Rome', 'Timezone changes back again');
    assert.equal(autocomplete.value, '', 'City is empty again');
  });
});
