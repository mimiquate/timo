import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | Landing', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /teams/1 without exisiting username', async function (assert) {
    await visit('/teams/1');

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });
});