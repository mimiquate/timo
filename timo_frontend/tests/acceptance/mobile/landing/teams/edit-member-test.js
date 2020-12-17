import { module, test } from 'qunit';
import { click, fillIn, visit, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession, chooseTimeZone, chooseCity } from 'timo-frontend/tests/helpers/custom-helpers';
import { setBreakpoint } from 'ember-responsive/test-support';

module('Mobile | Acceptance | Update member', function (hooks) {
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

    this.user = user;
    this.team = team;

    setSession.call(this, this.user);

    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team
    });

    setBreakpoint('mobile');
  });

  test('Updates member', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');
    await click('[data-test=modal-edit-member]');

    await fillIn('.add-member-modal__member-name input', 'Member 2');
    await chooseTimeZone('America/Buenos_Aires');

    await click('[data-test=update-button]');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(members[1].textContent.trim(), 'Member 2');

    assert.equal(timezones[0].textContent.trim(), 'America/Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'America/Buenos_Aires');
  });

  test('Updates member with city', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');
    await click('[data-test=modal-edit-member]');

    await fillIn('.add-member-modal__member-name input', 'Member City');
    await chooseCity('Buenos Aires');

    await click('[data-test=update-button]');

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(members[1].textContent.trim(), 'Member City');

    assert.equal(timezones[0].textContent.trim(), 'America/Montevideo');
    assert.equal(timezones[1].textContent.trim(), 'Buenos Aires, Argentina');
  });

  test('Updates member with time zone but with only whitespace name error', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');

    assert.dom(find('.member-list__modal'));

    const members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members[1].textContent.trim(), 'Member 1');
    assert.equal(timezones[1].textContent.trim(), 'America/Montevideo');

    await click('[data-test=modal-edit-member]');
    await fillIn('.add-member-modal__member-name input', '     ');
    await click('[data-test=update-button]');

    const errorMessage = find('.t-input__error');

    assert.dom('.member-list__modal').exists('Stays in edit member modal');
    assert.equal(errorMessage.textContent.trim(), `Name can't be blank`);
  });

  test('Remove member from team', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');

    let members = findAll('.member-list__member__name');
    const timezones = findAll('.member-list__member__location');

    assert.equal(members.length, 2);
    assert.equal(members[0].textContent.trim(), 'Current location');
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
    assert.equal(members[0].textContent.trim(), 'Current location');
  });

  test('Timezone and city inputs depend on each other', async function (assert) {
    await visit(`/teams/${this.team.id}`);
    await click('.team-header__details');
    await click('[data-test=modal-edit-member]');

    const autocomplete = find('.t-autocomplete input');

    await chooseTimeZone('America/Montevideo');

    assert.dom('.t-dropdown').hasText('America/Montevideo', 'Correct timezone');
    assert.equal(autocomplete.value, '', 'City is empty');

    await chooseCity('Buenos Aires');

    assert.dom('.t-dropdown').hasText('America/Buenos_Aires', 'Timezone changes to city one');
    assert.equal(autocomplete.value, 'Buenos Aires, Argentina', 'Correct city');

    await chooseTimeZone('America/Montevideo');

    assert.dom('.t-dropdown').hasText('America/Montevideo', 'Timezone changes back again');
    assert.equal(autocomplete.value, '', 'City is empty again');
  });
});
