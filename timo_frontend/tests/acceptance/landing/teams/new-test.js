import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn, find, findAll } from '@ember/test-helpers';
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
    assert.dom('.team-list__name').exists('Team is listed');
  });

  test('Creates teams and they are listed', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');

    await createTeam('Team 1')
    await createTeam('Team 2');

    assert.equal(currentURL(), '/teams/2', 'Lands in team page');

    const teams = findAll('.team-list__name');

    assert.equal(teams.length, 2);

    assert.equal(teams[0].textContent, 'Team 1');
    assert.equal(teams[1].textContent, 'Team 2');
  });

  test('Create team with no name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=new-team]');
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');
    assert.equal(errorMessage.textContent, `Team's name can't be blank`, 'Show empty team name error');
  });

  test('Create team with only whitespace name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await createTeam('    ')

    let errorMessage = find('.t-input__error');
    assert.equal(errorMessage.textContent, `Team's name can't be blank`, 'Show empty team name error');
  });

  test('Closes modal and resets its inputs', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=new-team]');
    await fillIn('.t-modal__team-name input', 'test');
    await click('[data-test=cancel-button]');

    assert.dom('.t-modal').doesNotExist('New team modal closes');

    await click('[data-test=new-team]');

    assert.dom('.t-modal__team-name input').hasText('', 'Empty input');
  });
});
