import { module, test } from 'qunit';
import { visit, currentURL} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from '../../../helpers/custom-helpers';

module('Acceptance | Landing', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /teams/new without exisiting username', async function (assert) {
    await visit('/teams/new');

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });

  test('Visiting /teams/new with existing username', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    await visit('/teams/new');

    assert.equal(currentURL(), '/teams/new', 'Correctly visits landing page');
    assert.dom('[data-test-rr=currentUser-span]').hasText('juan', 'Correct current user');
    assert.dom('[data-test-rr=newTeam-title]').exists('New team page images loads');
  });
});