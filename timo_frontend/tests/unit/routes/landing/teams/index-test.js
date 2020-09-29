import { module, test } from 'qunit';
import { visit, currentURL, findAll, click } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';

module('Unit | Route | landing index', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('Redirects to landing then login', async function (assert) {
    await visit('/teams');

    assert.equal(currentURL(), '/login');
  });

  test('Redirects to landing with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/teams');

    assert.equal(currentURL(), '/');
  });

  test('show correct current routes', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const teamOne = this.server.create('team', { name: 'Team1', user });
    const teamTwo = this.server.create('team', { name: 'Team2', user });

    setSession.call(this, user);

    await visit('/');

    assert.equal(currentURL(), `/teams/${teamOne.id}`);

    await visit(`/teams/${teamTwo.id}`);

    assert.equal(currentURL(), `/teams/${teamTwo.id}`);

    await click('[data-test=edit-team-button]');
    await click('.about-team-modal__delete-label');
    let buttons = findAll('.about-team-modal__delete-confirmation-container .t-button');
    await click(buttons[1]);

    assert.equal(currentURL(), `/teams/${teamOne.id}`);

    await click('[data-test=edit-team-button]');
    await click('.about-team-modal__delete-label');
    buttons = findAll('.about-team-modal__delete-confirmation-container .t-button');
    await click(buttons[1]);

    assert.equal(currentURL(), '/');

    assert.dom('.no-team__label').hasText(`Hi, there, You don’t have any teams yet!`);
    assert.dom('[data-test=create-team]').hasText("Create a team now!");
  });
});
