import { module, test } from 'qunit';
import { visit, click, find, findAll, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TablePage } from 'ember-table/test-support';
import moment from 'moment';
import { setupWindowMock } from 'ember-window-mock/test-support';
import window from 'ember-window-mock';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';
import { assertTooltipVisible, assertTooltipNotVisible  } from 'ember-tooltips/test-support';

let table = new TablePage();

module('Acceptance | Public Team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  function setGETTeamsHandler(server) {
    server.get('/teams', function (schema, request) {
      let share_id = request.queryParams['filter[share_id]'];
      let team = schema.teams.findBy({ share_id: share_id, public: true });

      return team;
    }, 200);
  }

  test('Visiting /p/team/:share_id without exisiting team', async function (assert) {
    this.server.get('/teams', { errors: [{ detail: 'Not Found' }] }, 404);
    await visit('/p/team/yjHktCOyBDTb');

    assert.dom('[data-test=team-error]').exists('Visits team page error');
    assert.dom('[data-test=team-error]').hasText('error Team not found', 'Team page error shows error');
  });

  test('Visiting /p/team/:share_id with private team', async function (assert) {
    this.server.get('/teams', { errors: [{ detail: 'Not Found' }] }, 404);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: false,
        share_id: 'yjHktCOyBDTb'
      });

    await visit(`/p/team/${newTeam.share_id}`);

    assert.dom('[data-test=team-error]').exists('Visits team page error');
    assert.dom('[data-test=team-error]').hasText('error Team not found', 'Team page error shows error');
  });

  test('Visiting /p/team/:share_id with public team and no members', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      });

    await visit(`/p/team/${newTeam.share_id}`);

    assert.dom('[data-test=team-title]').exists('New team title page loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const timezoneDivs = findAll('.timezone-list__row');
    assert.equal(timezoneDivs.length, 1, 'Has only one timezone, the one from the user');

    const timezoneLocation = find('.timezone-list__location');
    assert.equal(
      timezoneLocation.textContent.trim(),
      'America, Montevideo (you)',
      'Correct location'
    );

    const timeNow = moment.tz('America/Montevideo').startOf('hour');

    const timezoneDetail = find('.timezone-list__details');
    const details = timeNow.format('dddd, DD MMMM YYYY, HH:mm');
    assert.ok(timezoneDetail.textContent.includes(details), 'Correct date details');
    assert.ok(timezoneDetail.textContent.includes('1 member'), 'Correct members details');

    const timezoneHours = findAll('.timezone-list__hour');
    assert.equal(timezoneHours.length, 40, 'Correct amount of hours');

    const currentTimezoneHour = find('.timezone-list__current');
    const currentTime = timeNow.format('HH.mm');
    assert.equal(currentTimezoneHour.textContent.trim(), currentTime, 'Correct current time');
  });

  test('Visiting /p/team/:share_id with existing team and members', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const timezoneDivs = findAll('.timezone-list__row');
    assert.equal(timezoneDivs.length, 2, 'Has two timezones');

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo (you)',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'America, Buenos Aires',
      'Correct second location'
    );

    const timeNowMontevideo = moment.tz('America/Montevideo').startOf('hour');
    const timeNowBuenosAires = moment.tz('America/Buenos_Aires').startOf('hour');

    const timezoneDetails = findAll('.timezone-list__details');
    const detailsMontevideo = timeNowMontevideo.format('dddd, DD MMMM YYYY, HH:mm');
    const detailsBuenosAires = timeNowBuenosAires.format('dddd, DD MMMM YYYY, HH:mm');
    assert.ok(
      timezoneDetails[0].textContent.includes(detailsMontevideo),
      'Correct first row date details'
    );
    assert.ok(
      timezoneDetails[0].textContent.includes('2 members'),
      'Correct first row members details'
    );
    assert.ok(
      timezoneDetails[1].textContent.includes(detailsBuenosAires),
      'Correct second row date details'
    );
    assert.ok(
      timezoneDetails[1].textContent.includes('1 member'),
      'Correct second row members details'
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
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'Europe/Rome',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo (you)',
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

  test('Visit public team with grouped timezones query', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}?groupTimezones=true`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 1, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo (you) + America, Buenos Aires',
      'Correct grouped location'
    );
  });

  test('Group 2 timezones into another', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      }
    );
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Argentina/Buenos_Aires',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 3, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo (you)',
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

    const newTimezoneLocations = findAll('.timezone-list__location');
    assert.equal(newTimezoneLocations.length, 1, 'Correct amount of timezones');
    assert.equal(
      newTimezoneLocations[0].textContent.trim(),
      'America, Montevideo (you) + America, Argentina, Buenos Aires + 1 other timezone',
      'Correct grouped location'
    );
  });

  test('Group 3 timezones into another', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      }
    );
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Argentina/Buenos_Aires',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Buenos_Aires',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 3',
      timezone: 'America/Cordoba',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 4, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo (you)',
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

    const newTimezoneLocations = findAll('.timezone-list__location');
    assert.equal(newTimezoneLocations.length, 1, 'Correct amount of timezones');
    assert.equal(
      newTimezoneLocations[0].textContent.trim(),
      'America, Montevideo (you) + America, Argentina, Buenos Aires + 2 other timezones',
      'Correct grouped location'
    );
  });

  test('No timezones groupes into each other', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      }
    );
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'Asia/Ho_Chi_Minh',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 2, 'Correct amount of timezones');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo (you)',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'Asia, Ho Chi Minh',
      'Correct second location'
    );

    await click('.timezone-list__group-timezones .t-checkbox');

    const newTimezoneLocations = findAll('.timezone-list__location');
    assert.equal(newTimezoneLocations.length, 2, 'Correct amount of timezones');
    assert.equal(
      newTimezoneLocations[0].textContent.trim(),
      'America, Montevideo (you)',
      'Correct first location'
    );
    assert.equal(
      newTimezoneLocations[1].textContent.trim(),
      'Asia, Ho Chi Minh',
      'Correct second location'
    );
  });

  test('Opens google calendar when clicking time box and closes it', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      }
    );

    await visit(`/p/team/${newTeam.share_id}`);
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
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      }
    );

    const calendarBase = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Team Team scheduled event&';
    const timeNow = moment();
    const timeFormat = `${timeNow.year()}${timeNow.format('MM')}${timeNow.format('DD')}`;

    const startHour = timeNow.clone().format('HH');
    const endHour = timeNow.clone().add(1, 'hours').format('HH');

    const calendarDate = `dates=${timeFormat}T${startHour}0000/${timeFormat}T${endHour}0000`;
    const calendarUrl = `${calendarBase}${calendarDate}`;

    await visit(`/p/team/${newTeam.share_id}`);

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
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      }
    );

    await visit(`/p/team/${newTeam.share_id}`);

    let time = moment.tz('America/Montevideo').startOf('hour');

    const timezoneDetail = find('.timezone-list__details');
    let details = time.format('dddd, DD MMMM YYYY, HH:mm');

    assert.ok(timezoneDetail.textContent.includes(details), 'Correct date details');

    const timezoneHours = findAll('.timezone-list__hour');

    const selectedIndex = timezoneHours.findIndex(
      (h => h.classList.contains('timezone-list__selected'))
    );
    let selectedTimeBox = find('.timezone-list__selected');
    let currentTime = time.format('HH.mm');

    assert.equal(selectedTimeBox.textContent.trim(), currentTime, 'Correct selected time');

    await click(timezoneHours[selectedIndex + 2]);

    time.add(2, 'hour');
    details = time.format('dddd, DD MMMM YYYY, HH:mm');

    assert.ok(timezoneDetail.textContent.includes(details), 'Correct new date details');

    const newSelectedIndex = timezoneHours.findIndex(
      (h => h.classList.contains('timezone-list__selected'))
    );
    selectedTimeBox = find('.timezone-list__selected');
    currentTime = time.format('HH.mm');

    assert.equal(selectedTimeBox.textContent.trim(), currentTime, 'Correct new selected time');
    assert.ok(newSelectedIndex === selectedIndex + 2, 'Correct selected index');
  });

  test('User can login if is not logged', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      });

    await visit(`/p/team/${newTeam.share_id}`);

    assert.dom('[data-test=log-in]').exists();
    assert.dom('[data-test=log-in]').hasText('Log in');

    await click('[data-test=log-in]');

    assert.equal(currentURL(), '/login');
  });

  test('User can sign up if is not logged', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create(
      'team',
      {
        name: 'Team',
        user: newUser,
        public: true,
        share_id: 'yjHktCOyBDTb'
      });

    await visit(`/p/team/${newTeam.share_id}`);

    assert.dom('[data-test=create-account]').exists();
    assert.dom('[data-test=create-account]').hasText('Create Account');

    await click('[data-test=create-account]');

    assert.equal(currentURL(), '/sign-up');
  });

  test('Login and SignUp button doesnt appear if user is logged', async function (assert) {
    setGETTeamsHandler(this.server);
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);

    let newTeam = this.server.create('team', {
      name: 'Team',
      user: newUser,
      public: true,
      share_id: 'yjHktCOyBDTb'
    });

    await visit(`/p/team/${newTeam.share_id}`);

    assert.dom('[data-test=log-in]').doesNotExist();
    assert.dom('[data-test=create-account]').doesNotExist();

    server.get('/teams', schema => {
      return schema.teams.all();
    }, 200);

    await click('.shared-team-header__image');

    assert.equal(currentURL(), '/teams/1');
  });
});
