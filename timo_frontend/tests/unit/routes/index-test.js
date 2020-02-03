import { module, test } from 'qunit';
import { visit, currentURL } from "@ember/test-helpers";
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Unit | Route | index', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('Redirects to login', async function (assert) {
    await visit('/');

    assert.equal(currentURL(), '/login');
  });

  test('Redirects to landing with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    this.server.get('/users/me', () => {
      return newUser;
    });

    await visit('/');

    assert.equal(currentURL(), '/landing');
  });
});