import { module, test } from 'qunit';
import { click, fillIn, visit, find, findAll, triggerEvent } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, chooseCity } from 'timo-frontend/tests/helpers/custom-helpers';

module('Acceptance | Update member', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });
    this.server.create('city', {
      name: 'Buenos Aires',
      country: 'Argentina',
      timezone: 'America/Buenos_Aires'
    });
    const city = this.server.create('city', {
      name: 'Montevideo',
      country: 'Uruguay',
      timezone: 'America/Montevideo'
    });

    this.user = user;
    this.team = team;

    setSession.call(this, this.user);

    this.server.create('member', {
      name: 'Member 1',
      team,
      city
    });
  });

  test('Show all members in list', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');
    await click('.member-list__edit-icon');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseCity('Buenos Aires');

    await click('[data-test=cancel-button]');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(members[1].textContent.trim(), 'Member 1');

    assert.equal(timezones[0].textContent.trim(), 'America, Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'Montevideo, Uruguay');
  });

  test('Show all members in list with one city', async function (assert) {
    const city = this.server.create('city', {
      name: 'Rome',
      country: 'Italy',
      timezone: 'Europe/Rome'
    });
    this.server.create('member', {
      name: 'Member City',
      timezone: 'Europe/Rome',
      team: this.team,
      city
    });

    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');
    await click('.member-list__edit-icon');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseCity('Buenos Aires');

    await click('[data-test=cancel-button]');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(members[1].textContent.trim(), 'Member 1');
    assert.equal(members[2].textContent.trim(), 'Member City');

    assert.equal(timezones[0].textContent.trim(), 'America, Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'Montevideo, Uruguay');
    assert.equal(timezones[2].textContent.trim(), 'Rome, Italy');
  });

  test('Updates member', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');
    await click('.member-list__edit-icon');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseCity('Buenos Aires');

    await click('[data-test=update-button]');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(members[1].textContent.trim(), 'Member 2');

    assert.equal(timezones[0].textContent.trim(), 'America, Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'Buenos Aires, Argentina');
  });

  test('Updates member pressing enter', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');
    await click('.member-list__edit-icon');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseCity('Buenos Aires');

    await triggerEvent('.t-form', 'submit');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(members[1].textContent.trim(), 'Member 2');

    assert.equal(timezones[0].textContent.trim(), 'America, Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'Buenos Aires, Argentina');
  });

  test('Updates member with city', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');
    await click('.member-list__edit-icon');

    await fillIn('.add-member-modal__member-name input', 'Member City');
    await chooseCity('Buenos Aires');

    await click('[data-test=update-button]');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(members[1].textContent.trim(), 'Member City');

    assert.equal(timezones[0].textContent.trim(), 'America, Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'Buenos Aires, Argentina');
  });

  test('Remove member from team', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');

    let members = findAll('.member-list__member__name');
    let timezones = findAll('.member-list__member__location');

    assert.equal(members.length, 2);
    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(members[1].textContent.trim(), 'Member 1');

    assert.equal(timezones[0].textContent.trim(), 'America, Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'Montevideo, Uruguay');
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
    assert.equal(members[0].textContent.trim(), 'Current location');
  });
});
