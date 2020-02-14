import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from '../helpers/custom-helpers';

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
});
