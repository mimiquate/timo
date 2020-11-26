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
    const user = this.server.create('user', { username: 'juan' });

    setSession.call(this, user);

    await visit('/');

    assert.equal(currentURL(), '/');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
  });

  test('Redirects to first team', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    await visit('/');

    assert.equal(currentURL(), `/teams/${team.id}`);
  });
});
