import { module, test } from 'qunit';
import { visit, currentURL, click, findAll, find, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';
import { clickTrigger, selectChoose } from 'ember-power-select/test-support/helpers';

module('Mobile | Complete Test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    setBreakpoint('mobile');
  });

  test('Complete user path', async function (assert) {
    // Create Account
    await visit('/sign-up');

    let inputs = findAll('.sign-up-page__input input');

    await fillIn(inputs[0], 'John');
    await fillIn(inputs[1], 'john@cena.com');
    await fillIn(inputs[2], 'mysecretpassword');
    await fillIn(inputs[3], 'mysecretpassword');

    await click('.sign-up-page__form-button');

    assert.dom('.verify-email-modal').exists();
    assert.equal(
      find('.verify-email-modal__title').textContent.trim(),
      'Check your email'
    );

    await click('.verify-email-modal__close');

    //Login
    await visit('/login');

    this.server.get('/users/me', (schema) => {
      return schema.users.first();
    }, 200);

    inputs = findAll('.login-page__input input');

    await fillIn(inputs[0], 'John');
    await fillIn(inputs[1], 'mysecretpassword');
    await click('.login-page__form-button');

    assert.equal(currentURL(), '/');

    //Landing with no teams
    assert.dom('[data-test=landing-image]').exists();
    assert.dom('.no-team__label').hasText(`Hi, there, You don’t have any teams yet!`);
    assert.dom('[data-test=create-team]').hasText('Create a team now!');
    assert.dom('[data-test=log-out]').hasText('Log out');

    //Create team
    await click('[data-test=create-team]');

    assert.dom('.t-modal').exists();

    await fillIn('.t-modal__team-name input', 'Team 1');
    await click('[data-test=save-button]');

    assert.equal(currentURL(), '/teams/1');
    assert.dom('[data-test=team-title]').hasText('Team 1');

    await click('.team-header__mobile-sidenavbar');

    const teams = findAll('.team-list__name');

    assert.equal(teams.length, 1);
    assert.equal(teams[0].textContent, 'Team 1');

    await click(teams[0]);

    let timezones = findAll('.timezone-list__row');
    let timezonesLocation = find('.timezone-list__location');
    let timezoneMembers = find('.timezone-list__members');

    assert.equal(timezones.length, 1);
    assert.equal(timezonesLocation.textContent.trim(), 'America, Montevideo');
    assert.equal(timezoneMembers.textContent.trim(), 'Current location');

    assert.equal(find('.team-header__details').textContent.trim(), 'No members');
    //Edit team
    await click('.team-header__mobile-tooltip-actions');

    let actions = findAll('.header-tooltip__item');

    assert.equal(actions[0].textContent.trim(), 'Edit team');

    await click(actions[0]);
    await fillIn('.t-input input', 'Team 2');
    await click('[data-test=save-button]');

    assert.dom('[data-test=team-title]').hasText('Team 2');

    //Add Member
    await click('.team-header__mobile-tooltip-actions');

    assert.equal(actions[1].textContent.trim(), 'Add members');

    await click(actions[1]);
    await fillIn('.t-input input', 'Chris');
    await clickTrigger('.t-dropdown');
    await selectChoose('.t-dropdown', 'Europe/Rome');
    await click('[data-test=save-button]');

    timezones = findAll('.timezone-list__row');
    timezonesLocation = findAll('.timezone-list__location');
    timezoneMembers = findAll('.timezone-list__members');

    assert.equal(timezones.length, 2);
    assert.equal(timezonesLocation[0].textContent.trim(), 'America, Montevideo');
    assert.equal(timezoneMembers[0].textContent.trim(), 'Current location');

    assert.equal(timezones.length, 2);
    assert.equal(timezonesLocation[1].textContent.trim(), 'Europe, Rome');
    assert.equal(timezoneMembers[1].textContent.trim(), 'Chris');

    //Edit member
    const membersLabel = find('.team-header__details');

    assert.equal(membersLabel.textContent.trim(), '1 Member');

    await click(membersLabel);

    assert.dom(find('.member-list__modal'));

    let members = findAll('.member-list__member__name');
    timezones = findAll('.member-list__member__timezone');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(timezones[0].textContent.trim(), 'America/Montevideo');

    assert.equal(members[1].textContent.trim(), 'Chris');
    assert.equal(timezones[1].textContent.trim(), 'Europe/Rome');

    await click('[data-test=modal-edit-member]');
    await fillIn('.add-member-modal__member-name input', 'Pratt');

    await click('[data-test=update-button]');

    members = findAll('.member-list__member__name');
    timezones = findAll('.member-list__member__timezone');

    assert.equal(members[0].textContent.trim(), 'Current location');
    assert.equal(timezones[0].textContent.trim(), 'America/Montevideo');

    assert.equal(members[1].textContent.trim(), 'Pratt');
    assert.equal(timezones[1].textContent.trim(), 'Europe/Rome');

    //Delete member
    await click('.member-list__trash-icon');

    assert.equal(
      find('.member-list__delete-confirmation-label').textContent.trim(),
      'Remove Pratt?'
    );
    assert.equal(
      find('button.t-button.warning').textContent.trim(),
      'Confirm'
    );

    await click('button.t-button.warning');

    members = findAll('.member-list__member__name');
    assert.equal(members.length, 1);
    assert.equal(members[0].textContent.trim(), 'Current location');

    await click('.t-modal__close');

    timezones = findAll('.timezone-list__row');
    timezonesLocation = find('.timezone-list__location');
    timezoneMembers = find('.timezone-list__members');

    assert.equal(timezones.length, 1);
    assert.equal(timezonesLocation.textContent.trim(), 'America, Montevideo');
    assert.equal(timezoneMembers.textContent.trim(), 'Current location');

    //Delete team
    await click('.team-header__mobile-tooltip-actions');

    actions = findAll('.header-tooltip__item');

    await click(actions[0]);
    await click('.about-team-modal__delete-label');

    assert.equal(
      find('.about-team-modal__delete-confirmation-label').textContent.trim(),
      'Are you sure you want to delete?'
    );

    const buttons = findAll('.about-team-modal__delete-confirmation-container .t-button');
    assert.equal(buttons[1].textContent.trim(), 'Confirm', 'Delete team button');

    await click(buttons[1]);

    assert.dom('.no-team__label').hasText(`Hi, there, You don’t have any teams yet!`);
    assert.equal(currentURL(), '/');
  });
});
