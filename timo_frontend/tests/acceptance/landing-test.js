import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';

module('Acceptance | Landing', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting / (landing) without exisiting username', async function (assert) {
    await visit('/');

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });

  test('Visiting / (landing) with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');

    assert.equal(currentURL(), '/', 'Correctly visits landing page');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
    assert.dom('[data-test=no-team]')
      .hasText('You don\'t have any teams yet', 'No teams are listed');
  });

  test('Clicks link to Add one team', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=new-team]');

    assert.equal(currentURL(), '/teams/new', 'Correctly visits new team page');
  });

  test('Clicks team name and redirects to selected team page', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit('/');
    await click('[data-test-team="0"] a');

    assert.equal(currentURL(), `/teams/${newTeam.id}`, 'Redirects to team page');
    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');
  });

  test('Clicks username and then logouts', async function (assert) {
    const store = this.owner.lookup('service:store');
    let newUser = this.server.create('user', { username: 'juan', store: store });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=logout-trigger]');
    await click('[data-test=logout-button] button');

    assert.equal(currentURL(), `/login`, 'Redirects to login page');

    await visit('/');

    assert.equal(currentURL(), `/login`, 'Stays on login page');
  });

  test('Opens delete team modal', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test-delete-team="0"]');

    assert.dom('[data-test-delete-team=modal]').exists('Opens delete team modal');
    assert.dom('[data-test-delete-team=title]')
      .hasText('Confirm team deletion', 'Correct title');
    assert.dom('[data-test-delete-team=message]')
      .hasText(`Are you sure you want to delete team ${newTeam.name} ?`, 'Correct message');
    assert.dom('[data-test-delete-team=cancel]').hasText('Cancel', 'Cancel button');
    assert.dom('[data-test-delete-team=yes]').hasText('Yes', 'Delete team button');
  })

  test('Deletes team', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test-delete-team="0"]');
    await click('[data-test-delete-team=yes]');

    assert.dom('[data-test-delete-team=modal]').doesNotExist('Closes delete team modal');
    assert.notOk(this.server.db.teams.find(newTeam.id), 'Succesfully deletes team');
  });

  test('Cancels team deletion', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test-delete-team="0"]');
    await click('[data-test-delete-team=cancel]');

    assert.dom('[data-test-delete-team=modal]').doesNotExist('Closes delete team modal');
    assert.ok(this.server.db.teams.find(newTeam.id), 'Team still exists');
  });
});
