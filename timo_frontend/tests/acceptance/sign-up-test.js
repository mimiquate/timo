import { module, test } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setSession } from '../helpers/custom-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | Login', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /sign-up', async function (assert) {
    await visit('/sign-up');

    assert.equal(currentURL(), '/sign-up', 'Correctly visits sign up page');
  });

  test('Visiting /sign-up with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/sign-up');

    assert.equal(currentURL(), '/', 'Correctly redirects to landing page');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
  });

  test('Click login link', async function (assert) {
    await visit('/sign-up');
    await click('[data-test=login-link]');

    assert.equal(currentURL(), '/login', 'Visits login page');
  })
});