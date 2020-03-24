import { module, test } from 'qunit';
import { click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, chooseTimeZone, openNewMemberModal } from '../../../helpers/custom-helpers';
import { TablePage } from 'ember-table/test-support';

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

    const table = new TablePage();

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member (America/Montevideo)',
      'Member is listed'
    );
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
    assert.ok(errorMessage[1].textContent
      .includes('This is required'), 'No member time zone error');
  });

  test('Create member with name but no time zone error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await openNewMemberModal(newTeam.id);
    await fillIn('#memberName-input input', 'Member');
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.parentElement.querySelectorAll('.paper-input-error');

    assert.dom('[data-test=new-member-modal]').exists('Stays in new member modal');
    assert.ok(errorMessage[0].textContent
      .includes('This is required'), 'No member time zone error');
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

    assert.dom('[data-test=new-member-modal]').exists('Stays in new member modal');
  });
});