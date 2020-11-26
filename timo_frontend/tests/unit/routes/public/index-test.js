import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';

module('Unit | Route | public index', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('Redirects to login', async function (assert) {
    await visit('/p');

    assert.equal(currentURL(), '/login');
  });

  test('Redirects to landing with existing username', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    setSession.call(this, user);

    await visit('/p');

    assert.equal(currentURL(), '/');
  });
});
