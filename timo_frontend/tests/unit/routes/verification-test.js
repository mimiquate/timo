import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';

module('Unit | Route | Verification', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('Visits verification', async function (assert) {
    await visit('/verification');

    assert.equal(currentURL(), '/verification', 'Stays in verification error page');
    assert.dom('[data-test=title]').hasText('Timo App', 'Title loads correctly');
    assert.dom('[data-test=verification]')
      .hasText(
        'announcement Please check your email and verify your account',
        'Message loads correctly'
      );
  });

  test('Redirects to landing with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/verification');

    assert.equal(currentURL(), '/');
    assert.dom('[data-test=current-user-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test=landing-image]').exists('Landing page images loads');
  });
});