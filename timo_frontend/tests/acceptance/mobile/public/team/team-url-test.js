import { module, test } from 'qunit';
import { visit, click, find, findAll, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import moment from 'moment';
import { setupWindowMock } from 'ember-window-mock/test-support';
import window from 'ember-window-mock';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';
import { assertTooltipVisible, assertTooltipNotVisible  } from 'ember-tooltips/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';

module('Mobile | Acceptance | Public Team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(function() {
    this.mvdCity = this.server.create('city', {
      name: 'Montevideo',
      country: 'Uruguay',
      timezone: 'America/Montevideo'
    });

    this.bsasCity = this.server.create('city', {
      name: 'Buenos Aires',
      country: 'Argentina',
      timezone: 'America/Buenos_Aires'
    });

    this.cordobaCity = this.server.create('city', {
      name: 'Córdoba',
      country: 'Argentina',
      timezone: 'America/Argentina/Cordoba'
    });

    this.saoPauloCity = this.server.create('city', {
      name: 'São Paulo',
      country: 'Brazil',
      timezone: 'America/Sao_Paulo'
    });

    this.hoChiMinhCity = this.server.create('city', {
      name: 'Ho Chi Minh City',
      country: 'Vietnam',
      timezone: 'Asia/Ho_Chi_Minh'
    });

    setBreakpoint('mobile');
  });

  test('Visiting /p/team/:share_id without exisiting team', async function (assert) {
    this.server.get('/teams', { errors: [{ detail: 'Not Found' }] }, 404);
    await visit('/p/team/yjHktCOyBDTb');

    assert.dom('.not-found').exists('Visits team page error');
    assert.dom('.not-found__image').exists();
    assert.dom('.not-found__content__error').hasText('Team not found', 'Team page error shows error');
  });

  test('Visiting /p/team/:share_id with private team', async function (assert) {
    this.server.get('/teams', { errors: [{ detail: 'Not Found' }] }, 404);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: false,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);

    assert.dom('.not-found').exists('Visits team page error');
    assert.dom('.not-found__image').exists();
    assert.dom('.not-found__content__error').hasText('Team not found', 'Team page error shows error');
  });

  test('Visiting /p/team/:share_id with existing team and members', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    this.server.create('member', {
      name: 'Member 1',
      city: this.mvdCity,
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      city: this.bsasCity,
      team
    });

    await visit(`/p/team/${team.share_id}`);

    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const timezoneRows = findAll('.timezone-list__row');
    assert.equal(timezoneRows.length, 2, 'Has two timezones');

    assert.equal(
      find('.shared-team-header__details').textContent.trim(),
      '2 Members'
    );

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'Montevideo, Uruguay (Current location)',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'Buenos Aires, Argentina',
      'Correct second location'
    );

    const timeNowMontevideo = moment.tz('America/Montevideo').startOf('hour');
    const timeNowBuenosAires = moment.tz('America/Buenos_Aires').startOf('hour');

    const timezoneRowDates = findAll('.timezone-list__date');
    const timezoneMembers = findAll('.timezone-list__members');
    const expectedDateMontevideo = timeNowMontevideo.format('dddd, DD MMMM YYYY, HH:mm');
    const expectedDateBuenosAires = timeNowBuenosAires.format('dddd, DD MMMM YYYY, HH:mm');

    assert.ok(
      timezoneRowDates[0].textContent.includes(expectedDateMontevideo),
      'Correct first row date'
    );
    assert.ok(
      timezoneMembers[0].textContent.includes('Member 1'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowDates[1].textContent.includes(expectedDateBuenosAires),
      'Correct second row date'
    );
    assert.ok(
      timezoneMembers[1].textContent.includes('Member 2'),
      'Correct second row members'
    );

    const currentTimezoneHours = findAll('.timezone-list__current');
    const currentTimeMontevideo = timeNowMontevideo.format('HH.mm');
    const currentTimeBuenosAires = timeNowBuenosAires.format('HH.mm');
    assert.equal(
      currentTimezoneHours[0].textContent.trim(),
      currentTimeMontevideo,
      'Correct first row current time'
    );
    assert.equal(
      currentTimezoneHours[1].textContent.trim(),
      currentTimeBuenosAires,
      'Correct second row current time'
    );
  });

  test('Visit public and group timezones', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });
    this.server.create('member', {
      name: 'Member 2',
      city: this.bsasCity,
      team
    });

    await visit(`/p/team/${team.share_id}`);

    let timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 2, 'Correct amount of timezones');

    await click('.timezone-list__group-timezones .t-checkbox');

    timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 1, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'Buenos Aires, Argentina (Current location)',
      'Correct grouped location'
    );
  });

  test('Group 3 timezones into another', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    this.server.create('member', {
      name: 'Member 1',
      city: this.cordobaCity,
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      city: this.bsasCity,
      team
    });
    this.server.create('member', {
      name: 'Member 3',
      city: this.saoPauloCity,
      team
    });

    await visit(`/p/team/${team.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 4, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'Current location',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'Córdoba, Argentina',
      'Correct second location'
    );
    assert.equal(
      timezoneLocations[2].textContent.trim(),
      'Buenos Aires, Argentina',
      'Correct third location'
    );
    assert.equal(
      timezoneLocations[3].textContent.trim(),
      'São Paulo, Brazil',
      'Correct fourth location'
    );

    await click('.timezone-list__group-timezones .t-checkbox');

    const groupedTimezones = findAll('.timezone-list__location');
    assert.equal(groupedTimezones.length, 1, 'Correct amount of timezones');
    assert.equal(
      groupedTimezones[0].textContent.trim(),
      'Córdoba, Argentina + Buenos Aires, Argentina + 1 other location (Current location)',
      'Correct grouped location'
    );
  });

  test('Cant see group timezones if there is no timezone to group', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    this.server.create('member', {
      name: 'Member 1',
      city: this.mvdCity,
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      city: this.hoChiMinhCity,
      team
    });

    await visit(`/p/team/${team.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 2, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'Montevideo, Uruguay (Current location)',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'Ho Chi Minh City, Vietnam',
      'Correct second location'
    );

    assert.dom('.timezone-list__group-timezones .t-checkbox').doesNotExist();
  });

  test('Opens google calendar when clicking time box and closes it', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);
    await click('.timezone-list__selected');

    assertTooltipVisible(assert);

    await click('.google-calendar-popover__close');

    assertTooltipNotVisible(assert);
  })

  test('Schedule event in google calendar', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    const calendarBase = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Team Team scheduled event&';
    const timeNow = moment();
    const timeFormat = `${timeNow.year()}${timeNow.format('MM')}${timeNow.format('DD')}`;

    const startHour = timeNow.clone().format('HH');
    const endHour = timeNow.clone().add(1, 'hours').format('HH');

    const calendarDate = `dates=${timeFormat}T${startHour}0000/${timeFormat}T${endHour}0000`;
    const calendarUrl = `${calendarBase}${calendarDate}`;

    await visit(`/p/team/${team.share_id}`);

    window.open = (urlToOpen) => {
      assert.equal(
        urlToOpen,
        calendarUrl,
        'Correct google calendar link'
      );
    };

    await click('.timezone-list__selected');
    await click('.google-calendar-popover__icon');
  });

  test('Select box changes selected time', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);

    let time = moment.tz('America/Montevideo').startOf('hour');

    const timezoneRowDate = find('.timezone-list__date');
    let expectedDate = time.format('dddd, DD MMMM YYYY, HH:mm');

    assert.ok(timezoneRowDate.textContent.includes(expectedDate), 'Correct row date');

    const timezoneHours = findAll('.timezone-list__hour');

    const selectedIndex = timezoneHours.findIndex(h => {
      return h.classList.contains('timezone-list__selected')
    });
    let selectedTimeBox = find('.timezone-list__selected');
    let currentTime = time.format('HH.mm');

    assert.equal(selectedTimeBox.textContent.trim(), currentTime, 'Correct selected time');

    await click(timezoneHours[selectedIndex + 2]);

    time.add(2, 'hour');
    expectedDate = time.format('dddd, DD MMMM YYYY, HH:mm');

    assert.ok(timezoneRowDate.textContent.includes(expectedDate), 'Correct new date');

    const newSelectedIndex = timezoneHours.findIndex(h => {
      return h.classList.contains('timezone-list__selected')
    });
    selectedTimeBox = find('.timezone-list__selected');
    currentTime = time.format('HH.mm');

    assert.equal(selectedTimeBox.textContent.trim(), currentTime, 'Correct new selected time');
    assert.ok(newSelectedIndex === selectedIndex + 2, 'Correct selected index');
  });

  test('User can login if is not logged', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);

    assert.dom('.shared-team-header__mobile-actions').exists();
    await click('.shared-team-header__mobile-actions');

    const userActions = findAll('.header-tooltip__item');

    assert.dom(userActions[0]).hasText('Log in');

    await click(userActions[0]);

    assert.equal(currentURL(), '/login');
  });

  test('User can sign up if is not logged', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);

    assert.dom('.shared-team-header__mobile-actions').exists();
    await click('.shared-team-header__mobile-actions');

    const userActions = findAll('.header-tooltip__item');

    assert.dom(userActions[1]).hasText('Create Account');

    await click(userActions[1]);

    assert.equal(currentURL(), '/sign-up');
  });

  test('Login and SignUp button doesnt appear if user is logged', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    setSession.call(this, user);

    await visit(`/p/team/${team.share_id}`);

    assert.dom('.shared-team-header__actions').doesNotExist();
  });
});
