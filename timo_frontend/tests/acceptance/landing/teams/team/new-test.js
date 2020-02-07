import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, chooseTimeZone } from '../../../../helpers/custom-helpers';
import { TablePage } from 'ember-table/test-support';

module('Acceptance | New member', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /teams/team/new without exisiting username', async function (assert) {
    await visit('/teams/team/new');

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });

  test('Visiting /teams/team/new with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}/new`);

    assert.equal(currentURL(), `/teams/${newTeam.id}/new`, 'Correctly visits new member page');
    assert.dom('[data-test=new-member-title]').exists('New member title page loads');
    assert.dom('[data-test=new-member-title]').hasText('New Member', 'Correct title');
  });

  test('Resets inputs when entering new member page', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}/new`);
    await fillIn('#memberName-input input', 'Member');
    await chooseTimeZone('America/Montevideo');
    await visit(`/teams/${newTeam.id}`);

    assert.equal(currentURL(), `/teams/${newTeam.id}`, 'Moves to team page');

    await visit(`/teams/${newTeam.id}/new`);

    assert.equal(currentURL(), `/teams/${newTeam.id}/new`, 'Moves to new member page');
    assert.dom('#memberName-input input').hasText('', 'Member name input is empty');
    assert.dom('#memberTimeZone-select').hasText('Time Zone', 'Member time zone is empty');
  });

  test('Creates member and redirects', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}/new`);
    await fillIn('#memberName-input input', 'Member');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=saveMember-button]');

    assert.equal(currentURL(), `/teams/${newTeam.id}`, 'Redirects to team page');
    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const table = new TablePage();

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(table.headers.objectAt(0).text.trim(), 'Member (America/Montevideo)',
      'Member is listed');
  });

  test('Create member with no name and no time zone error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}/new`);
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), `/teams/${newTeam.id}/new`, 'Stays in new member page');
    assert.ok(errorMessage[0].textContent.includes('This is required'),
      'No member name error');
    assert.ok(errorMessage[1].textContent.includes('This is required'),
      'No member time zone error');
  });

  test('Create member with name but no time zone error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}/new`);
    await fillIn('#memberName-input input', 'Member');
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), `/teams/${newTeam.id}/new`, 'Stays in new member page');
    assert.ok(errorMessage[0].textContent.includes('This is required'),
      'No member time zone error');
  });

  test('Create member with time zone but no name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}/new`);
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), `/teams/${newTeam.id}/new`, 'Stays in new member page');
    assert.ok(errorMessage[0].textContent.includes('This is required'),
      'No member name error');
  });

  test('Create member with time zone but with only whitespace name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}/new`);
    await fillIn('#memberName-input input', '     ');
    await chooseTimeZone('America/Montevideo');
    await click('[data-test=saveMember-button]');

    assert.equal(currentURL(), `/teams/${newTeam.id}/new`, 'Stays in new member page');
  });
});