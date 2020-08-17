import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
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
});