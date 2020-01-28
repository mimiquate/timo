import { module, test } from 'qunit';
import { visit, currentURL } from "@ember/test-helpers";
import { setupTest } from 'ember-qunit';

module('Unit | Route | index', function(hooks) {
  setupTest(hooks);

  test('Redirects to login', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/login');
  });
});
