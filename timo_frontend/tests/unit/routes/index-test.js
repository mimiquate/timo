import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';

module('Unit | Route | index', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('Redirects to login', async function (assert) {
    await visit('/');

    assert.equal(currentURL(), '/login');
  });

  test('Redirects to landing with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
  });

  test('Redirects to first team', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit('/');

    assert.equal(currentURL(), `/teams/${newTeam.id}`);
  });
});
