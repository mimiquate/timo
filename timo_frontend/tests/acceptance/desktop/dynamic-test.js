import { module, test } from 'qunit';
import { visit, click, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { assertTooltipVisible, assertTooltipNotVisible  } from 'ember-tooltips/test-support';

module('Acceptance | Dynamic Team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('Visiting dynamic team', async function (assert) {
    await visit(
      '/dynamic-team?America/Montevideo[]=Santiago&America/Montevideo[]=Marcelo&Canada/Central[]=Juan&Canada/Central[]=Kevin&name=Test'
    );

    assert.dom('[data-test=team-title]').hasText('Test');
    assert.equal(
      find('.shared-team-header__details').textContent.trim(),
      '4 Members'
    );

    const timezoneDivs = findAll('.timezone-list__row');
    assert.equal(timezoneDivs.length, 2);

    const timezonesLocation = findAll('.timezone-list__location');

    assert.equal(
      timezonesLocation[0].textContent.trim(),
      'America, Montevideo',
    );
    assert.equal(
      timezonesLocation[1].textContent.trim(),
      'Canada, Central',
    );

    const timezoneMembers = findAll('.timezone-list__members');
    assert.ok(timezoneMembers[0].textContent.includes('Santiago and Marcelo (Current location)'));
    assert.ok(timezoneMembers[1].textContent.includes('Juan and Kevin'));
  });

  test('User can open Google Calendar tooltip', async function (assert) {
    await visit(
      '/dynamic-team?America/Montevideo[]=Santiago&America/Montevideo[]=Marcelo&name=Test'
    );
    await click('.timezone-list__selected');

    const calendarPopverLabel = find('.google-calendar-popover__label');
    const calendarPopoverButton = find('.google-calendar-popover__button');

    assertTooltipVisible(assert);
    assert.equal(calendarPopverLabel.textContent.trim(), 'Schedule event on Google Calendar', 'Correct label');
    assert.equal(calendarPopoverButton.textContent.trim(), 'Schedule now', 'Correct button text');

    await click('.google-calendar-popover__close');

    assertTooltipNotVisible(assert);
  });

  test('Can group timezones', async function (assert) {
    await visit(
      '/dynamic-team?America/Montevideo[]=Member 1&America/Buenos_Aires[]=Member 2&America/Cordoba[]=Member 3&name=Test'
    );

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 3);
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'America, Buenos Aires',
      'Correct third location'
    );
    assert.equal(
      timezoneLocations[2].textContent.trim(),
      'America, Cordoba',
      'Correct fourth location'
    );

    await click('.timezone-list__group-timezones .t-checkbox');

    const newTimezoneLocations = findAll('.timezone-list__location');
    assert.equal(newTimezoneLocations.length, 1);
    assert.equal(
      newTimezoneLocations[0].textContent.trim(),
      'America, Montevideo + America, Buenos Aires + 1 other timezone',
    );
  });
});
