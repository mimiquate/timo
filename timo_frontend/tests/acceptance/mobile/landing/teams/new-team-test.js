import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  click,
  fillIn,
  find,
  findAll
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';
import { setBreakpoint } from 'ember-responsive/test-support';

module('Mobile | Acceptance | New team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    setBreakpoint('mobile');
  });

  test('Creates new team and redirects', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=create-team]');
    await fillIn('.t-modal__team-name input', 'Team 1');
    await click('[data-test=save-button]');

    assert.equal(currentURL(), '/teams/1', 'Lands in team page');
    assert.dom('[data-test=new-team-modal]').doesNotExist('New team modal closes');
    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team 1', 'Team title loads');
  });

  test('Creates teams and they are listed', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');

    await click('[data-test=create-team]');
    await fillIn('.t-modal__team-name input', 'Team 1');
    await click('[data-test=save-button]');

    await click('.team-header__mobile-sidenavbar');
    await click('[data-test=new-team]');
    await fillIn('.t-modal__team-name input', 'Team 2');
    await click('[data-test=save-button]');

    assert.equal(currentURL(), '/teams/2', 'Lands in team page');

    await click('.team-header__mobile-sidenavbar');

    const teams = findAll('.team-list__name');

    assert.equal(teams.length, 2);
    assert.equal(teams[0].textContent, 'Team 1');
    assert.equal(teams[1].textContent, 'Team 2');
  });

  test('Show error if create team with no name', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=create-team]');
    await click('[data-test=save-button]');

    let errorMessage = find('.t-input__error');
    assert.equal(errorMessage.textContent, `Team's name can't be blank`, 'Show empty team name error');
  });
});
