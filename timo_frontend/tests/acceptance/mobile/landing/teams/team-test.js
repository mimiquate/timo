import { module, test } from 'qunit';
import { visit, currentURL, click, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';
import moment from 'moment';
import { setupWindowMock } from 'ember-window-mock/test-support';
import window from 'ember-window-mock';
import { assertTooltipVisible, assertTooltipNotVisible  } from 'ember-tooltips/test-support';
import { setBreakpoint } from 'ember-responsive/test-support';

module('Mobile | Acceptance | Team', function (hooks) {
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

  test('Visiting /teams/team without exisiting username', async function (assert) {
    await visit('/teams/team').catch(() => {});

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });

  test('Visiting /teams/team with existing username and no members', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, team);

    await visit(`/teams/${team.id}`);

    assert.equal(currentURL(), `/teams/${team.id}`, 'Correctly visits team page');
    assert.dom('[data-test=team-title]').exists('New team title page loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const timezoneRows = findAll('.timezone-list__row');
    assert.equal(timezoneRows.length, 1, 'Has only one timezone, the one from the user');

    const timezoneLocation = find('.timezone-list__location');
    assert.equal(
      timezoneLocation.textContent.trim(),
      'Current location',
      'Correct location'
    );

    const timeNow = moment.tz('America/Montevideo').startOf('hour');
    const timezoneRowDate = find('.timezone-list__date');
    const expectedDate = timeNow.format('dddd, DD MMMM YYYY, HH:mm');

    assert.ok(timezoneRowDate.textContent.includes(expectedDate), 'Correct row date');
    assert.ok(find('.timezone-list__members').textContent.includes('You'), 'Correct row members');

    const timezoneHours = findAll('.timezone-list__hour');
    assert.equal(timezoneHours.length, 36, 'Correct amount of hours');

    const currentTimezoneHour = find('.timezone-list__current');
    const currentTime = timeNow.format('HH.mm');
    assert.equal(currentTimezoneHour.textContent.trim(), currentTime, 'Correct current time');
  });

  test('Visiting /teams/team with existing username and members', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

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

    await visit(`/teams/${team.id}`);

    assert.equal(currentURL(), `/teams/${team.id}`, 'Correctly visits team page');
    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const timezoneRows = findAll('.timezone-list__row');
    assert.equal(timezoneRows.length, 2, 'Has two timezones');
    assert.equal(
      find('.team-header__details').textContent.trim(),
      '2 Members'
    );

    const timezoneLocations = findAll('.timezone-list__location');
    assert.ok(timezoneLocations[0].textContent.includes('Montevideo, Uruguay'));
    assert.ok(timezoneLocations[0].textContent.includes('(Current location)'));

    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'Buenos Aires, Argentina',
      'Correct second location'
    );

    const timeNowMontevideo = moment.tz('America/Montevideo').startOf('hour');
    const timeNowBuenosAires = moment.tz('America/Buenos_Aires').startOf('hour');

    const timezoneRowDates = findAll('.timezone-list__date');
    const timezoneMembers = findAll('.timezone-list__members');

    const dateMontevideo = timeNowMontevideo.format('dddd, DD MMMM YYYY, HH:mm');
    const dateBuenosAires = timeNowBuenosAires.format('dddd, DD MMMM YYYY, HH:mm');
    assert.ok(
      timezoneRowDates[0].textContent.includes(dateMontevideo),
      'Correct first row date'
    );
    assert.ok(
      timezoneMembers[0].textContent.includes('Member 1'),
      'Correct first row members'
    );
    assert.ok(
      timezoneRowDates[1].textContent.includes(dateBuenosAires),
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

  test('Team with member in users current timezone', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    this.server.create('member', {
      name: 'Member 1',
      city: this.mvdCity,
      team
    });

    await visit(`/teams/${team.id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 1, 'Only one timezone');
    assert.ok(timezoneLocations[0].textContent.includes('Montevideo, Uruguay'));
    assert.ok(timezoneLocations[0].textContent.includes('(Current location)'));

    const timezoneMembers = find('.timezone-list__members');
    assert.ok(
      timezoneMembers.textContent.includes('Member 1'),
      'Correct amount of members in timezone'
    );
  });

  test('Clicks share button', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user, public: false });

    setSession.call(this, user);

    await visit(`/teams/${team.id}`);
    await click('.team-header__mobile-tooltip-actions');

    const actions = findAll('.header-tooltip__item');
    await click(actions[2]);

    assert.equal(find('.t-modal__title').textContent.trim(), `Share "Team"`, 'Modal has content');
    assert.dom('.share-team__public-container .t-checkbox').exists('Checkbox exists');

    const copyButton = find('.share-team__copy-link-button');
    assert.dom(copyButton).exists('Copy link button exists');
    assert.equal(copyButton.textContent.trim(), 'Copy Link', 'Button has correct text');

    assert.ok(copyButton.disabled, 'Button is disabled');
  });

  test('Clicks share button and change public', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user, public: false });

    setSession.call(this, user);

    this.server.patch('/teams/:id', function ({ teams }, request) {
      let { data } = JSON.parse(request.requestBody);
      let team = teams.findBy({ id: data.id });
      let public_flag = data.attributes.public;
      let share_id = public_flag ? 'yjHktCOyBDTb' : null;

      return team.update({
        share_id,
        public: public_flag
      })
    }, 200);

    await visit(`/teams/${team.id}`);
    await click('.team-header__mobile-tooltip-actions');

    const actions = findAll('.header-tooltip__item');
    await click(actions[2]);
    await click('.share-team__public-container .t-checkbox');

    const copyLinkButton = find('.share-team__copy-link-button');
    const shareLink = find('.share-team__link-input input');

    assert.equal(team.public, true, 'Changes view to public');
    assert.notOk(copyLinkButton.disabled, 'Button is enabled');
    assert.ok(shareLink.value.includes('/p/team/yjHktCOyBDTb'), 'Correct link');

    await click('.share-team__public-container .t-checkbox');

    assert.equal(team.public, false, 'Changes view to not public');
    assert.ok(copyLinkButton.attributes.disabled, 'Button is disabled');
    assert.equal(shareLink.value, '', 'Empty link');
  });

  test('Visit team and group timezones', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    this.server.create('member', {
      name: 'Member 2',
      city: this.bsasCity,
      team
    });

    setSession.call(this, user);

    await visit(`/teams/${team.id}`);
    await click('.timezone-list__group-timezones .t-checkbox');

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 1, 'Correct amount of timezones');
    assert.ok(timezoneLocations[0].textContent.includes('Buenos Aires, Argentina'));
    assert.ok(timezoneLocations[0].textContent.includes('(Current location)'));
  });

  test('Group 2 timezones into another', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

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

    setSession.call(this, user);

    await visit(`/teams/${team.id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 3, 'Correct amount of timezones');
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

    await click('.timezone-list__group-timezones .t-checkbox');

    const groupedTimezones = findAll('.timezone-list__location');
    assert.equal(groupedTimezones.length, 1, 'Correct amount of timezones');
    assert.ok(groupedTimezones[0].textContent.includes('Córdoba, Argentina'));
    assert.ok(groupedTimezones[0].textContent.includes('(Current location)'));
  });

  test('Group 3 timezones into another', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

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

    setSession.call(this, user);

    await visit(`/teams/${team.id}`);

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
    assert.ok(
      groupedTimezones[0].textContent.includes(
        'Córdoba, Argentina + Buenos Aires, Argentina + 1 other location'
      )
    );
    assert.ok(groupedTimezones[0].textContent.includes('(Current location)'));
  });

  test('Cant see group timezones if there is no timezone to group', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

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

    setSession.call(this, user);

    await visit(`/teams/${team.id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 2, 'Correct amount of timezones');
    assert.ok(timezoneLocations[0].textContent.includes('Montevideo, Uruguay'));
    assert.ok(timezoneLocations[0].textContent.includes('(Current location)'));

    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'Ho Chi Minh City, Vietnam',
      'Correct second location'
    );

    assert.dom('.timezone-list__group-timezones .t-checkbox').doesNotExist();
  });

  test('Opens google calendar when clicking time box and closes it', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    this.server.create('member', {
      name: 'Member 1',
      city: this.mvdCity,
      team
    });

    setSession.call(this, user);

    await visit(`/teams/${team.id}`);
    await click('.timezone-list__selected');

    assertTooltipVisible(assert);

    await click('.google-calendar-popover__close');

    assertTooltipNotVisible(assert);
  })

  test('Schedule event in google calendar', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    this.server.create('member', {
      name: 'Member 1',
      city: this.mvdCity,
      team
    });

    setSession.call(this, user);

    const calendarBase = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Team Team scheduled event&';
    const timeNow = moment();
    const timeFormat = `${timeNow.year()}${timeNow.format('MM')}${timeNow.format('DD')}`;

    const startHour = timeNow.clone().format('HH');
    const endHour = timeNow.clone().add(1, 'hours').format('HH');

    const calendarDate = `dates=${timeFormat}T${startHour}0000/${timeFormat}T${endHour}0000`;
    const calendarUrl = `${calendarBase}${calendarDate}`;

    await visit(`/teams/${team.id}`);

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
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    await visit(`/teams/${team.id}`);

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

  test('Selected index resets on team change', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const teamOne = this.server.create('team', { name: 'Team 1', user });
    const teamTwo = this.server.create('team', { name: 'Team 2', user });

    setSession.call(this, user);

    await visit(`/teams/${teamOne.id}`);

    const timezoneHours = findAll('.timezone-list__hour');
    const selectedIndex = 2 + timezoneHours.findIndex(h => {
      return h.classList.contains('timezone-list__selected')
    });

    await click(timezoneHours[selectedIndex]);
    await click('.team-header__mobile-sidenavbar');
    await click(findAll('.team-list__button')[1]);

    assert.equal(currentURL(), `/teams/${teamTwo.id}`, 'Verifies team change');

    const selectedTimeBox = find('.timezone-list__selected');
    const newTimezoneHours = findAll('.timezone-list__hour');
    const timezoneRowDate = find('.timezone-list__date');

    const time = moment.tz('America/Montevideo').startOf('hour');
    const expectedDate = time.format('dddd, DD MMMM YYYY, HH:mm');
    const currentTime = time.format('HH.mm');
    const resetedSelectedIndex = newTimezoneHours.findIndex(h => {
      return h.classList.contains('timezone-list__selected')
    });

    assert.notEqual(resetedSelectedIndex, selectedIndex, 'Resets selected index');
    assert.ok(timezoneRowDate.textContent.includes(expectedDate), 'Correct row date');
    assert.equal(selectedTimeBox.textContent.trim(), currentTime, 'Correct selected time');
  });

  test('Can see the number of members left in each timezone', async function (assert) {
    const user = this.server.create('user', { username: 'juan' });
    const team = this.server.create('team', { name: 'Team', user });

    setSession.call(this, user);

    this.server.create('member', {
      name: 'Member 1',
      city: this.mvdCity,
      team
    });
    this.server.create('member', {
      name: 'Member 2',
      city: this.mvdCity,
      team
    });
    this.server.create('member', {
      name: 'Member 3',
      city: this.mvdCity,
      team
    });
    this.server.create('member', {
      name: 'Member 4',
      city: this.mvdCity,
      team
    });
    this.server.create('member', {
      name: 'Member 5',
      city: this.mvdCity,
      team
    });
    this.server.create('member', {
      name: 'Member 6',
      city: this.mvdCity,
      team
    });

    await visit(`/teams/${team.id}`);

    const timezoneMembers = find('.timezone-list__members');

    assert.ok(
      timezoneMembers.textContent.includes('Member 1, Member 2, Member 3, Member 4 and 2'),
      'Correct first row members'
    );
  });
});
