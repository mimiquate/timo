import { module, test } from 'qunit';
import { visit, currentURL, click, findAll, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';
import { assertTooltipRendered, assertTooltipContent } from 'ember-tooltips/test-support';

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
    assert.dom('.no-team__label').hasText(`Hi, there, You don’t have any teams yet!`);
    assert.dom('[data-test=create-team]').hasText("Create a team now!");

    await click('[data-test=create-team]');

    assert.dom('.t-modal').exists('Opens new team modal');
  });

  test('Clicks button to Add one team and opens new team modal', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');
    await click('[data-test=new-team]');

    assert.dom('.t-modal').exists('Opens new team modal');
    assert.dom('.t-modal__title').hasText('Create a Team', 'Correct title');
    assert.dom('.t-modal__close').exists('Close modal button');
    assert.dom('.t-modal__team-name input').hasText('', 'Empty input');

    assert.dom('[data-test=cancel-button]').hasText('Cancel', 'Cancel button');
    assert.dom('[data-test=save-button]').hasText('Create', 'Save button');
  });

  test('Clicks team name and redirects to selected team page', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit('/');
    const teamButtons = findAll('.team-list__button');
    await click(teamButtons[0]);

    assert.equal(currentURL(), `/teams/${newTeam.id}`, 'Redirects to team page');
    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');
  });

  test('Clicks username and then logouts', async function (assert) {
    const store = this.owner.lookup('service:store');
    let newUser = this.server.create('user', { username: 'juan', store: store });
    setSession.call(this, newUser);

    await visit('/');

    await click(find('#user-name'));

    assertTooltipRendered(assert);
    assertTooltipContent(assert, { contentString: 'Logout' });

    await click(find('.logout-button'));

    assert.equal(currentURL(), `/login`, 'Redirects to login page');

    await visit('/');

    assert.equal(currentURL(), `/login`, 'Stays on login page');
  });

  test('Opens delete team modal', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit('/');
    await click('.team-list__button');
    await click('[data-test=edit-team-button]');

    assert.dom('.about-team-modal').exists('Opens delete team modal');
    assert.dom('.t-modal__title').hasText('About', 'Correct title');

    const team = find('.t-input input');

    assert.equal(team.value, newTeam.name);
    assert.dom('.about-team-modal__delete-label').hasText('Delete team', 'Cancel button');

    await click('.about-team-modal__delete-label');

    assert.equal(
      find('.about-team-modal__delete-confirmation-label').textContent.trim(),
      'Are you sure you want to delete?'
    );

    const buttons = findAll('.about-team-modal__delete-confirmation-container .t-button');
    assert.equal(buttons[0].textContent.trim(), 'Cancel', 'Cancel button');
    assert.equal(buttons[1].textContent.trim(), 'Confirm', 'Delete team button');
  })

  test('Deletes team', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit('/');
    await click('.team-list__button');
    await click('[data-test=edit-team-button]');
    await click('.about-team-modal__delete-label');

    const buttons = findAll('.about-team-modal__delete-confirmation-container .t-button');
    await click(buttons[1]);

    assert.dom('.about-team-modal').doesNotExist('Closes delete team modal');
    assert.notOk(this.server.db.teams.find(newTeam.id), 'Succesfully deletes team');
  });

  test('Cancels team deletion', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit('/');
    await click('.team-list__button');
    await click('[data-test=edit-team-button]');
    await click('.t-modal__close');

    assert.dom('.about-team-modal').doesNotExist('Closes delete team modal');
    assert.ok(this.server.db.teams.find(newTeam.id), 'Team still exists');
    assert.equal(currentURL(), '/teams/1', 'Stays in landing page');
  });

  test('Deletes currently viewing team', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit('/');
    await click('.team-list__button');

    assert.equal(currentURL(), `/teams/${newTeam.id}`, 'Moves to team page');

    await click('[data-test=edit-team-button]');
    await click('.about-team-modal__delete-label');

    const buttons = findAll('.about-team-modal__delete-confirmation-container .t-button');
    await click(buttons[1]);

    assert.dom('.about-team-modal').doesNotExist('Closes delete team modal');
    assert.notOk(this.server.db.teams.find(newTeam.id), 'Succesfully deletes team');
    assert.equal(currentURL(), '/', 'Redirects to landing page');
  });
});
