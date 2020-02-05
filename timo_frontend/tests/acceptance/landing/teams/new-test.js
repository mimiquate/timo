import { module, test } from 'qunit';
import { visit, currentURL, click} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, createTeam } from '../../../helpers/custom-helpers';

module('Acceptance | Landing', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /teams/new without exisiting username', async function (assert) {
    await visit('/teams/new');

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });

  test('Visiting /teams/new with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/teams/new');

    assert.equal(currentURL(), '/teams/new', 'Correctly visits landing page');
    assert.dom('[data-test-rr=currentUser-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test-rr=newTeam-title]').exists('New team page title loads');
  });

  test('Creates new team and redirects', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/teams/new');
    await createTeam('Team 1')

    assert.equal(currentURL(), '/teams/1', 'Lands in team page');
    assert.dom('[data-test-rr=team-title]').exists('Team title loads');
    assert.dom('[data-test-rr=team-title]').hasText('Team 1', 'Team title loads');
    assert.dom('[data-test-rr=team-item]').exists('Team is listed');
  });

  test('Creates teams and they are listed', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/teams/new');

    assert.dom('[data-test-rr=team-container]').hasText('You don\'t have any teams yet',
      'No teams are listed');

    await createTeam('Team 1')
    await visit('/teams/new');
    await createTeam('Team 2')

    assert.equal(currentURL(), '/teams/2', 'Lands in team page');
    assert.dom('[data-test-rr=team-item]').exists({ count: 2 }, 'All teams are listed');
    assert.dom('[data-test-rr=team-item]:first-child').hasText('Team 1',
      'The first team in the list contains the team name');
    assert.dom('[data-test-rr=team-item]:last-child').hasText('Team 2',
      'The second team in the list contains the team name');
  });

  test('Create team with no name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/teams/new');
    await click('[data-test-rr=saveTeam-button]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), '/teams/new', 'Stays in new team page');
    assert.ok(errorMessage[0].textContent.includes('This is required'),
      'No team name error');
  });

  test('Create team with only whitespace name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/teams/new');
    await createTeam('    ')

    assert.equal(currentURL(), '/teams/new', 'Stays in new team page');
  });
});