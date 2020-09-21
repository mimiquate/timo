import { module, test } from 'qunit';
import { click, fillIn, visit, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, chooseTimeZone } from 'timo-frontend/tests/helpers/custom-helpers';

module('Acceptance | Update member', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Resets inputs when entering new member page', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);
    await click('.group-header__details');
    await click('.member-list__edit-label');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseTimeZone('America/Buenos_Aires');

    await click('[data-test=cancel-button]');

    assert.equal(
      find('.member-list__member__name').textContent.trim(),
      'Member 1'
    );
    assert.equal(
      find('.member-list__member__timezone').textContent.trim(),
      'America/Montevideo'
    );
  });

  test('Updates member', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);
    await click('.group-header__details');
    await click('.member-list__edit-label');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseTimeZone('America/Buenos_Aires');

    await click('[data-test=update-button]');

    assert.equal(
      find('.member-list__member__name').textContent.trim(),
      'Member 2'
    );
    assert.equal(
      find('.member-list__member__timezone').textContent.trim(),
      'America/Buenos_Aires'
    );
  });

  test('Updates member with time zone but with only whitespace name error', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);
    await click('.group-header__details');

    assert.dom(find('.member-list__modal'));
    assert.equal(
      find('.member-list__member__name').textContent.trim(),
      'Member 1'
    );
    assert.equal(
      find('.member-list__member__timezone').textContent.trim(),
      'America/Montevideo'
    );

    await click('.member-list__edit-label');

    await fillIn('.add-member-modal__member-name input', '     ');
    await click('[data-test=update-button]');

    const errorMessage = find('.t-input__error');

    assert.dom('.member-list__modal').exists('Stays in edit member modal');
    assert.equal(errorMessage.textContent.trim(), `Name can't be blank`);
  });
});
