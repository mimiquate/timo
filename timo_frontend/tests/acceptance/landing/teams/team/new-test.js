import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from '../../../../helpers/custom-helpers';

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

  test('Create member with no name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}/new`);
    await click('[data-test=saveMember-button]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), `/teams/${newTeam.id}/new`, 'Stays in new member page');
    assert.ok(errorMessage[0].textContent.includes('This is required'),
      'No member name error');
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
});