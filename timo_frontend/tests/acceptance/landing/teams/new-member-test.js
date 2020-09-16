import { module, test } from 'qunit';
import { click, fillIn, findAll, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, chooseTimeZone, openNewMemberModal } from 'timo-frontend/tests/helpers/custom-helpers';

module('Acceptance | New member', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Resets inputs when entering new member page', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await fillIn('.t-input input', 'Member');

    await chooseTimeZone('America/Montevideo');

    await click('.t-modal__close');

    await openNewMemberModal(newTeam.id);

    assert.dom('.t-input input').hasText('', 'Member name input is empty');
    assert.dom('.t-dropdown').hasText('Select timezone', 'Member time zone is empty');
  });

  test('Creates member and closes modal', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await fillIn('.t-input input', 'Member');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').doesNotExist('Correctly closes new member modal');

    const timezoneRowDetails = findAll('.timezone-list__location');

    assert.equal(timezoneRowDetails.length, 1, 'List has one row');
    assert.equal(timezoneRowDetails[0].textContent.trim(), 'America Montevideo', 'Correct timezone');
  });

  test('Create member with no name and no time zone error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');

    assert.dom('.t-modal').exists('Stays in new member modal');
    assert.ok(errorMessage.textContent
      .includes(`Name can't be blank`), 'No member name error');
  });

  test('Create member with name but no time zone error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await fillIn('.t-input input', 'Member');
    await click('[data-test=save-button]');

    assert.dom('.t-modal').exists('Stays in new member modal');
  });

  test('Create member with time zone but no name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');

    assert.dom('.t-modal').exists('Stays in new member modal');
    assert.ok(errorMessage.textContent
      .includes(`Name can't be blank`), 'No member name error');
  });

  test('Create member with time zone but with only whitespace name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await fillIn('.t-input input', '     ');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');

    assert.dom('.t-modal').exists('Stays in new member modal');
    assert.ok(errorMessage.textContent
      .includes(`Name can't be blank`), 'No member name error');
  });
});
