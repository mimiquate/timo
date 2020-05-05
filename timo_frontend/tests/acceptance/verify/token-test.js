import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | Email Token', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Verify user email token', async function (assert) {
    let token = 'Sjj31.nad93aHD3dhd3ndHUB93';
    this.server.get('/verify', {}, 200);

    await visit(`/verify/${token}`);

    assert.equal(currentURL(), '/login', 'Correctly redirects login page');
  });

  test('Incorrect user email token', async function (assert) {
    let token = 'Sjj31.nad93aHD3dhd3ndHUB93';
    this.server.get(
      '/verify',
      {
        errors: [{
          detail: 'Verification token doesn\'t exists',
          status: '400',
          title: 'Invalid token'
        }]
      },
      400
    );

    await visit(`/verify/${token}`);

    assert.equal(currentURL(), `/verify/${token}`, 'Shows token error page');
    assert.dom('[data-test=title]').hasText('Timo App', 'Title loads correctly');
    assert.dom('[data-test=team-error]')
      .hasText('error Sorry that page doesn\'t exists', 'Message loads correctly');
  });
});