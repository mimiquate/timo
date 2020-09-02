import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, createTeam } from 'timo-frontend/tests/helpers/custom-helpers';

module('Acceptance | New team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Creates new team and redirects', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await createTeam('Team 1')

    assert.equal(currentURL(), '/teams/1', 'Lands in team page');
    assert.dom('[data-test=new-team-modal]').doesNotExist('New team modal closes');
    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team 1', 'Team title loads');
    assert.dom('[data-test-team]').exists('Team is listed');
  });

  test('Creates teams and they are listed', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');

    assert.dom('[data-test=no-team]')
      .hasText('You don\'t have any teams yet', 'No teams are listed');

    await createTeam('Team 1')

    await visit('/');
    await createTeam('Team 2');

    assert.equal(currentURL(), '/teams/2', 'Lands in team page');
    assert.dom('[data-test-team]').exists({ count: 2 }, 'All teams are listed');
    assert.dom('[data-test-team="0"] span').hasText(
      'Team 1',
      'The first team in the list contains the team name'
    );
    assert.dom('[data-test-team="1"] span').hasText(
      'Team 2',
      'The second team in the list contains the team name'
    );
  });

  test('Create team with no name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=new-team]');
    await click('[data-test-new-team=save]');

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), '/', 'Does not redirect to new team');
    assert.dom('[data-test=new-team-modal]').exists('New team modal does not close');
    assert.ok(errorMessage[0].textContent
      .includes('This is required'), 'No team name error');
  });

  test('Create team with only whitespace name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await createTeam('    ')

    let errorMessage = this.element.querySelectorAll('.paper-input-error');

    assert.equal(currentURL(), '/', 'Does not redirect to new team');
    assert.dom('[data-test=new-team-modal]').exists('New team modal does not close');
    assert.ok(errorMessage[0].textContent
      .includes('This is required'), 'No team name error');
  });

  test('Closes modal and resets its inputs', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=new-team]');
    await fillIn('#teamName-input input', 'test');
    await click('[data-test-new-team=close-modal]');

    assert.dom('[data-test=new-team-modal]').doesNotExist('New team modal closes');

    await click('[data-test=new-team]');

    assert.dom('#teamName-input input').hasText('', 'Empty input');
  });
});
