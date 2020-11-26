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
    const user = this.server.create('user', { username: 'juan' });

    setSession.call(this, user);

    await visit('/');

    assert.equal(currentURL(), '/', 'Correctly visits landing page');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
    assert.dom('.no-team__label').hasText(`Hi, there, You don’t have any teams yet!`);
    assert.dom('[data-test=create-team]').hasText("Create a team now!");

    await click('[data-test=create-team]');

    assert.dom('.t-modal').exists('Opens new team modal');
  });

  test('Clicks team name and redirects to selected team page', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    await visit('/');
    const teamButtons = findAll('.team-list__button');
    await click(teamButtons[0]);

    assert.equal(currentURL(), `/teams/${team.id}`, 'Redirects to team page');
    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');
  });

  test('Clicks username and then logouts', async function (assert) {
    const store = this.owner.lookup('service:store');
    const user = this.server.create('user', { username: 'juan', store });

    setSession.call(this, user);

    await visit('/');
    await click(find('#user-name'));

    assertTooltipRendered(assert);
    assertTooltipContent(assert, { contentString: 'Logout' });

    await click(find('.logout-button'));

    assert.equal(currentURL(), `/login`, 'Redirects to login page');

    await visit('/');

    assert.equal(currentURL(), `/login`, 'Stays on login page');
  });
});
