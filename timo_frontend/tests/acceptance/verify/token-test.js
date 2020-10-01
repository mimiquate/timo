import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | Email Token', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Verify user email token', async function (assert) {
    let token = 'Sjj31.nad93aHD3dhd3ndHUB93';
    this.server.patch('/users/:id', function (_schema, request) {
      assert.equal(request.queryParams.token, 'Sjj31.nad93aHD3dhd3ndHUB93')
    }, 200);

    await visit(`/verify/${token}`);

    assert.equal(currentURL(), '/login', 'Correctly redirects login page');
  });

  test('Incorrect user email token', async function (assert) {
    let token = 'Sjj31.nad93aHD3dhd3ndHUB93';
    this.server.patch(
      '/users/:id',
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
    assert.dom('.not-found').exists('Visits token page error');
    assert.dom('[data-test-not-found=title]').hasText('Timo App', 'Title loads correctly');
    assert.dom('.not-found__error')
      .hasText('Sorry that page doesn\'t exists', 'Message loads correctly');
  });
});