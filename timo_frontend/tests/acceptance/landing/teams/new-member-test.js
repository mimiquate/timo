import { module, test } from 'qunit';
import { click, fillIn, findAll } from '@ember/test-helpers';
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
    await fillIn('#memberName-input input', 'Member');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=close-member-modal]');

    await openNewMemberModal(newTeam.id);

    assert.dom('#memberName-input input').hasText('', 'Member name input is empty');
    assert.dom('#memberTimeZone-select').hasText('Time Zone', 'Member time zone is empty');
  });

  test('Creates member and closes modal', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await fillIn('#memberName-input input', 'Member');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=saveMember-button]');

    assert.dom('[data-test=new-member-modal]').doesNotExist('Correctly closes new member modal');

    const timezoneRowDetails = findAll('.timezone-list__details');

    assert.equal(timezoneRowDetails.length, 1, 'List has one row');
    assert.equal(timezoneRowDetails[0].textContent.trim(), 'America Montevideo', 'Correct timezone');
  });

  test('Create member with no name and no time zone error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.parentElement.querySelectorAll('.paper-input-error');

    assert.dom('[data-test=new-member-modal]').exists('Stays in new member modal');
    assert.ok(errorMessage[0].textContent
      .includes('This is required'), 'No member name error');
  });

  test('Create member with name but no time zone error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await fillIn('#memberName-input input', 'Member');
    await click('[data-test=saveMember-button]');

    assert.dom('[data-test=new-member-modal]').exists('Stays in new member modal');
  });

  test('Create member with time zone but no name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.parentElement.querySelectorAll('.paper-input-error');

    assert.dom('[data-test=new-member-modal]').exists('Stays in new member modal');
    assert.ok(errorMessage[0].textContent
      .includes('This is required'), 'No member name error');
  });

  test('Create member with time zone but with only whitespace name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await fillIn('#memberName-input input', '     ');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.parentElement.querySelectorAll('.paper-input-error');

    assert.dom('[data-test=new-member-modal]').exists('Stays in new member modal');
    assert.ok(errorMessage[0].textContent
      .includes('This is required'), 'No member name error');
  });
});