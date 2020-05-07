import { module, test } from 'qunit';
import { click, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, chooseTimeZone } from 'timo-frontend/tests/helpers/custom-helpers';
import { TablePage } from 'ember-table/test-support';

module('Acceptance | Update member', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Resets inputs when entering new member page', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    let newMember = this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);

    new TablePage();

    await click(`[data-test-member="${newMember.id}"]`);
    await fillIn('#memberName-input input', 'Member 2');
    await chooseTimeZone('America/Buenos_Aires');
    await click('[data-test=close-member-modal]');

    await click(`[data-test-member="${newMember.id}"]`);

    assert.dom('#memberName-input input').hasValue('Member 1', 'Member name resets');
    assert.dom('#memberTimeZone-select .ember-power-select-selected-item')
      .hasText('America/Montevideo', 'Member time zone resets');
  });

  test('Updates member and closes modal', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    let newMember = this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);
    const table = new TablePage();

    await click(`[data-test-member="${newMember.id}"]`);
    await fillIn('#memberName-input input', 'Member');
    await chooseTimeZone('America/Buenos_Aires');
    await click('[data-test=saveMember-button]');

    assert.dom('[data-test=edit-member-modal]')
      .doesNotExist('Correctly closes edit member modal');

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member (America/Buenos_Aires)',
      'Member is listed and updated'
    );
  });

  test('Updates member with time zone but no name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    let newMember = this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);
    new TablePage();

    await click(`[data-test-member="${newMember.id}"]`);
    await fillIn('#memberName-input input', '');
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.parentElement.querySelectorAll('.paper-input-error');

    assert.dom('[data-test=edit-member-modal]').exists('Stays in edit member modal');
    assert.ok(errorMessage[0].textContent
      .includes('This is required'), 'No member name error');
  });

  test('Updates member with time zone but with only whitespace name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    let newMember = this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);
    new TablePage();

    await click(`[data-test-member="${newMember.id}"]`);
    await fillIn('#memberName-input input', '     ');
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.parentElement.querySelectorAll('.paper-input-error');

    assert.dom('[data-test=edit-member-modal]').exists('Stays in edit member modal');
    assert.ok(errorMessage[0].textContent
      .includes('This is required'), 'No member name error');
  });
});