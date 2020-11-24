import { module, test } from 'qunit';
import { visit, click, find, findAll, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import moment from 'moment';
import { setupWindowMock } from 'ember-window-mock/test-support';
import window from 'ember-window-mock';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';
import { assertTooltipVisible, assertTooltipNotVisible  } from 'ember-tooltips/test-support';

module('Acceptance | Public Team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  function setGETTeamsHandler(server) {
    server.get('/teams', function (schema, request) {
      const share_id = request.queryParams['filter[share_id]'];
      const team = schema.teams.findBy({
        share_id,
        public: true
      });

      return team;
    }, 200);
  }

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

  test('Visiting /p/team/:share_id with public team and no members', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);

    assert.dom('[data-test=team-title]').exists('New team title page loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const timezoneDivs = findAll('.timezone-list__row');
    assert.equal(timezoneDivs.length, 1, 'Has only one timezone, the one from the user');

    const timezoneLocation = find('.timezone-list__location');
    assert.equal(
      timezoneLocation.textContent.trim(),
      'America, Montevideo',
      'Correct location'
    );

    const timeNow = moment.tz('America/Montevideo').startOf('hour');
    const timezoneRowDate = find('.timezone-list__date');
    const timezoneMember = find('.timezone-list__members');
    const expectedDate = timeNow.format('dddd, DD MMMM YYYY, HH:mm');

    assert.ok(timezoneRowDate.textContent.includes(expectedDate), 'Correct row date');
    assert.ok(timezoneMember.textContent.includes('Current location'), 'Correct row members');

    const timezoneHours = findAll('.timezone-list__hour');
    assert.equal(timezoneHours.length, 36, 'Correct amount of hours');

    const currentTimezoneHour = find('.timezone-list__current');
    const currentTime = timeNow.format('HH.mm');
    assert.equal(currentTimezoneHour.textContent.trim(), currentTime, 'Correct current time');
  });

  test('Visiting /p/team/:share_id with existing team and members', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
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
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'America, Buenos Aires',
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
      timezoneMembers[0].textContent.includes('Member 1 (Current location)'),
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

  test('Visiting /p/team/:share_id with members sorted', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'Europe/Rome',
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
      team
    });

    await visit(`/p/team/${team.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'America, Buenos Aires',
      'Correct second location'
    );
    assert.equal(
      timezoneLocations[2].textContent.trim(),
      'Europe, Rome',
      'Correct third location'
    );
  })

  test('Visit public and group timezones', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
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
      'America, Montevideo + America, Buenos Aires',
      'Correct grouped location'
    );
  });

  test('Group 2 timezones into another', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Argentina/Buenos_Aires',
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
      team
    });

    await visit(`/p/team/${team.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 3, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'America, Argentina, Buenos Aires',
      'Correct second location'
    );
    assert.equal(
      timezoneLocations[2].textContent.trim(),
      'America, Buenos Aires',
      'Correct third location'
    );

    await click('.timezone-list__group-timezones .t-checkbox');

    const groupedTimezones = findAll('.timezone-list__location');
    assert.equal(groupedTimezones.length, 1, 'Correct amount of timezones');
    assert.equal(
      groupedTimezones[0].textContent.trim(),
      'America, Montevideo + America, Argentina, Buenos Aires + 1 other timezone',
      'Correct grouped location'
    );
  });

  test('Group 3 timezones into another', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Argentina/Buenos_Aires',
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
      team
    });
    this.server.create('member', {
      name: 'Member 3',
      timezone: 'America/Cordoba',
      team
    });

    await visit(`/p/team/${team.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 4, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'America, Argentina, Buenos Aires',
      'Correct second location'
    );
    assert.equal(
      timezoneLocations[2].textContent.trim(),
      'America, Buenos Aires',
      'Correct third location'
    );
    assert.equal(
      timezoneLocations[3].textContent.trim(),
      'America, Cordoba',
      'Correct fourth location'
    );

    await click('.timezone-list__group-timezones .t-checkbox');

    const groupedTimezones = findAll('.timezone-list__location');
    assert.equal(groupedTimezones.length, 1, 'Correct amount of timezones');
    assert.equal(
      groupedTimezones[0].textContent.trim(),
      'America, Montevideo + America, Argentina, Buenos Aires + 2 other timezones',
      'Correct grouped location'
    );
  });

  test('Cant see group timezones if there is no timezone to group', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'Asia/Ho_Chi_Minh',
      team
    });

    await visit(`/p/team/${team.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 2, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'Asia, Ho Chi Minh',
      'Correct second location'
    );

    assert.dom('.timezone-list__group-timezones .t-checkbox').doesNotExist();
  });

  test('Opens google calendar when clicking time box and closes it', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);
    await click('.timezone-list__selected');

    const calendarPopverLabel = find('.google-calendar-popover__label');
    const calendarPopoverButton = find('.google-calendar-popover__button');

    assertTooltipVisible(assert);
    assert.equal(calendarPopverLabel.textContent.trim(), 'Schedule event on Google Calendar', 'Correct label');
    assert.equal(calendarPopoverButton.textContent.trim(), 'Schedule now', 'Correct button text');

    await click('.google-calendar-popover__close');

    assertTooltipNotVisible(assert);
  })

  test('Schedule event in google calendar', async function (assert) {
    setGETTeamsHandler(this.server);

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
    await click('.google-calendar-popover__button');
  });

  test('Select box changes selected time', async function (assert) {
    setGETTeamsHandler(this.server);

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
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);

    assert.dom('[data-test=log-in]').exists();
    assert.dom('[data-test=log-in]').hasText('Log in');

    await click('[data-test=log-in]');

    assert.equal(currentURL(), '/login');
  });

  test('User can sign up if is not logged', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);

    assert.dom('[data-test=create-account]').exists();
    assert.dom('[data-test=create-account]').hasText('Create Account');

    await click('[data-test=create-account]');

    assert.equal(currentURL(), '/sign-up');
  });

  test('Login and SignUp button doesnt appear if user is logged', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    setSession.call(this, user);

    await visit(`/p/team/${team.share_id}`);

    assert.dom('[data-test=log-in]').doesNotExist();
    assert.dom('[data-test=create-account]').doesNotExist();

    server.get('/teams', schema => {
      return schema.teams.all();
    }, 200);

    await click('.shared-team-header__image');

    assert.equal(currentURL(), '/teams/1');
  });

  test('Select box to the right of selected adds more boxes', async function (assert) {
    setGETTeamsHandler(this.server);

    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', {
      name: 'Team',
      user,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${team.share_id}`);

    let timezoneHours = findAll('.timezone-list__hour');
    let selectedIndex = timezoneHours.findIndex(h => {
      return h.classList.contains('timezone-list__selected')
    });
    const currentIndex = selectedIndex;

    assert.equal(timezoneHours.length, 36, 'Correct initial amount of hours');

    await click(timezoneHours[selectedIndex + currentIndex]);

    timezoneHours = findAll('.timezone-list__hour');
    selectedIndex += currentIndex;

    assert.equal(timezoneHours.length, 36, 'Does not add unnecessary time boxes');

    await click(timezoneHours[selectedIndex + 4]);

    timezoneHours = findAll('.timezone-list__hour');
    selectedIndex += 4;

    assert.equal(timezoneHours.length, 40, 'Correctly adds four time boxes');

    await click(timezoneHours[selectedIndex - 4]);

    timezoneHours = findAll('.timezone-list__hour');
    selectedIndex -= 4;

    assert.equal(timezoneHours.length, 40, 'Clicking to the left does not add time boxes');

    await click(timezoneHours[selectedIndex + 3]);

    timezoneHours = findAll('.timezone-list__hour');
    selectedIndex += 3;

    assert.equal(timezoneHours.length, 40, 'Does not add already added time boxes');
  });
});
