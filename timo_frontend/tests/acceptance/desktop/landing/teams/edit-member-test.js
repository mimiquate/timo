import { module, test } from 'qunit';
import { click, fillIn, visit, find, findAll, triggerEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, chooseTimeZone } from 'timo-frontend/tests/helpers/custom-helpers';

module('Acceptance | Update member', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Show all members in list', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team
    });

    await visit(`/teams/${team.id}`);
    await click('.team-header__details');
    await click('.member-list__edit-icon');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseTimeZone('America/Buenos_Aires');

    await click('[data-test=cancel-button]');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__timezone');

    assert.equal(members[0].textContent.trim(), 'You');
    assert.equal(members[1].textContent.trim(), 'Member 1');

    assert.equal(timezones[0].textContent.trim(), 'America/Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'America/Montevideo');
  });

  test('Updates member', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team
    });

    await visit(`/teams/${team.id}`);
    await click('.team-header__details');
    await click('.member-list__edit-icon');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseTimeZone('America/Buenos_Aires');

    await click('[data-test=update-button]');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__timezone');

    assert.equal(members[0].textContent.trim(), 'You');
    assert.equal(members[1].textContent.trim(), 'Member 2');

    assert.equal(timezones[0].textContent.trim(), 'America/Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'America/Buenos_Aires');
  });

  test('Updates member pressing enter', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team
    });

    await visit(`/teams/${team.id}`);
    await click('.team-header__details');
    await click('.member-list__edit-icon');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseTimeZone('America/Buenos_Aires');

    await triggerEvent('.t-form', 'submit');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__timezone');

    assert.equal(members[0].textContent.trim(), 'You');
    assert.equal(members[1].textContent.trim(), 'Member 2');

    assert.equal(timezones[0].textContent.trim(), 'America/Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'America/Buenos_Aires');
  });

  test('Updates member with time zone but with only whitespace name error', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team
    });

    await visit(`/teams/${team.id}`);
    await click('.team-header__details');

    assert.dom(find('.member-list__modal'));

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__timezone');

    assert.equal(members[1].textContent.trim(), 'Member 1');
    assert.equal(timezones[1].textContent.trim(), 'America/Montevideo');

    await click('.member-list__edit-icon');
    await fillIn('.add-member-modal__member-name input', '     ');
    await click('[data-test=update-button]');

    const errorMessage = find('.t-input__error');

    assert.dom('.member-list__modal').exists('Stays in edit member modal');
    assert.equal(errorMessage.textContent.trim(), `Name can't be blank`);
  });

  test('Remove member from team', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team
    });

    await visit(`/teams/${team.id}`);
    await click('.team-header__details');

    let members = findAll('.member-list__member__name');
    let timezones = findAll('.member-list__member__timezone');

    assert.equal(members.length, 2);
    assert.equal(members[0].textContent.trim(), 'You');
    assert.equal(members[1].textContent.trim(), 'Member 1');

    assert.equal(timezones[0].textContent.trim(), 'America/Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'America/Montevideo');
    assert.dom('.member-list__trash-icon').exists();

    await click('.member-list__trash-icon');

    assert.equal(
      find('.member-list__delete-confirmation-label').textContent.trim(),
      'Remove Member 1?'
    );
    assert.dom('button.t-button.warning').exists();
    assert.equal(
      find('button.t-button.warning').textContent.trim(),
      'Confirm'
    )

    await click('button.t-button.warning');

    members = findAll('.member-list__member__name');
    assert.equal(members.length, 1);
    assert.equal(members[0].textContent.trim(), 'You');
  });
});
