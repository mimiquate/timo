import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | Landing', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /landing without exisiting username', async function(assert) {
    await visit('/landing');

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });

  test('Visiting /landing with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    this.server.get('/users/me', () => {
      return newUser;
    });

    await visit('/landing');

    assert.equal(currentURL(), '/landing', 'Correctly visits landing page');
    assert.dom('[data-test-rr=currentUser-span]').hasText('juan', 'Correct current user');
  });
});
