import { module, test } from 'qunit';
import { visit, currentURL, click, find, findAll } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';
import { TablePage } from 'ember-table/test-support';
import moment from 'moment';
import { setupWindowMock } from 'ember-window-mock/test-support';
import window from 'ember-window-mock';

let table = new TablePage();

module('Acceptance | Team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('Visiting /teams/team without exisiting username', async function (assert) {
    await visit('/teams/team');

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });

  test('Visiting /teams/team with existing username and no members', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await visit(`/teams/${newTeam.id}`);

    assert.equal(currentURL(), `/teams/${newTeam.id}`, 'Correctly visits team page');
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

  test('Visiting /teams/team with existing username and members', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
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

    await visit(`/teams/${newTeam.id}`);

    assert.equal(currentURL(), `/teams/${newTeam.id}`, 'Correctly visits team page');
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
      'America, Buenos_Aires',
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

  test('Visiting /teams/team with members sorted', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
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

    await visit(`/teams/${newTeam.id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo (you)',
      'Correct first location'
    );
    assert.equal(
      timezoneLocations[1].textContent.trim(),
      'America, Buenos_Aires',
      'Correct second location'
    );
    assert.equal(
      timezoneLocations[2].textContent.trim(),
      'Europe, Rome',
      'Correct third location'
    );
  })

  test('Clicks button to add member', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await visit(`/teams/${newTeam.id}`);
    await click('[data-test=add-member-button]');

    assert.dom('.t-modal').exists('Correctly opens new member modal');
    assert.dom('.t-modal__title').exists('New member modal title loads');
    assert.dom('.t-modal__title').hasText('Add Members', 'Correct title');
  });

  test('Team with member in users current timezone', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);

    const timezoneLocations = findAll('.timezone-list__location');
    assert.equal(timezoneLocations.length, 1, 'Only one timezone');
    assert.equal(
      timezoneLocations[0].textContent.trim(),
      'America, Montevideo (you)',
      'Correct location'
    );

    const timezoneDetails = find('.timezone-list__details');
    assert.ok(
      timezoneDetails.textContent.includes('2 members'),
      'Correct amount of members in timezone'
    );
  });

  test('Clicks share button', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser, public: false });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);
    await click('[data-test=share-button]');

    assert.equal(find('.t-modal__title').textContent.trim(), `Share "Team"`, 'Modal has content');
    assert.dom('.t-checkbox').exists('Checkbox exists');

    const copyButton = find('.share-team__copy-link-button');
    assert.dom(copyButton).exists('Copy link button exists');
    assert.equal(copyButton.textContent.trim(), 'Copy Link', 'Button has correct text');

    assert.ok(copyButton.disabled, 'Button is disabled');
  });

  test('Clicks share button and change public', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser, public: false });
    setSession.call(this, newUser);
    this.server.patch('/teams/:id', function ({ teams }, request) {
      let { data } = JSON.parse(request.requestBody);
      let team = teams.findBy({ id: data.id });
      let public_flag = data.attributes.public;
      let share_id = public_flag ? 'yjHktCOyBDTb' : null;

      return team.update({
        share_id: share_id,
        public: public_flag
      })
    }, 200);

    await visit(`/teams/${newTeam.id}`);
    await click('[data-test=share-button]');
    await click('.t-checkbox');

    const copyLinkButton = find('.share-team__copy-link-button');

    assert.equal(newTeam.public, true, 'Changes view to public');
    assert.notOk(copyLinkButton.disabled, 'Button is enabled');

    await click('.t-checkbox');

    assert.equal(newTeam.public, false, 'Changes view to not public');
    assert.ok(copyLinkButton.attributes.disabled, 'Button is disabled');
  });

  test('Collapse table checkbox disable if no members', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);

    assert.dom('[data-test-checkbox=collapsed]').exists('Collapse table checkbox exists');
    assert.dom('[data-test-checkbox=collapsed]').hasText('Collapse table', 'Correct text');

    const collapsedCheckbox = find('[data-test-checkbox=collapsed]');
    assert.equal('disabled', collapsedCheckbox.attributes.disabled.value, 'Checkbox is disabled');
  });

  test('Collapse table checkbox disable if only one member', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);

    assert.dom('[data-test-checkbox=collapsed]').exists('Collapse table checkbox exists');
    assert.dom('[data-test-checkbox=collapsed]').hasText('Collapse table', 'Correct text');

    const collapsedCheckbox = find('[data-test-checkbox=collapsed]');
    assert.equal('disabled', collapsedCheckbox.attributes.disabled.value, 'Checkbox is disabled');
  });

  test('Collapse table checkbox enable if there are at least 2 members', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Los_Angeles',
      team: newTeam
    });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);

    assert.dom('[data-test-checkbox=collapsed]').exists('Collapse table checkbox exists');
    assert.dom('[data-test-checkbox=collapsed]').hasText('Collapse table', 'Correct text');

    const collapsedCheckbox = find('[data-test-checkbox=collapsed]');
    assert.notOk(collapsedCheckbox.attributes.disabled, 'Checkbox is enabled');
  });

  test('Collapse member into another', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);

    assert.equal(table.headers.length, 2, 'Table has two columns');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (America/Montevideo)',
      'Member 1 is listed'
    );
    assert.equal(
      table.headers.objectAt(1).text.trim(),
      'Member 2 (America/Montevideo)',
      'Member 2 is listed'
    );

    await click('[data-test-checkbox=collapsed]');

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (America/Montevideo) + 1 member',
      'Member 1 is listed showing collapsed state'
    );
  });

  test('Collapse 2 members into another', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 2',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 3',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);

    assert.equal(table.headers.length, 3, 'Table has two columns');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (America/Montevideo)',
      'Member 1 is listed'
    );
    assert.equal(
      table.headers.objectAt(1).text.trim(),
      'Member 2 (America/Montevideo)',
      'Member 2 is listed'
    );
    assert.equal(
      table.headers.objectAt(2).text.trim(),
      'Member 3 (America/Montevideo)',
      'Member 3 is listed'
    );

    await click('[data-test-checkbox=collapsed]');

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (America/Montevideo) + 2 members',
      'Member 1 is listed showing collapsed state'
    );
  });

  test('No member collapses into another', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
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
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);

    assert.equal(table.headers.length, 2, 'Table has two columns');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (America/Montevideo)',
      'Member 1 is listed'
    );
    assert.equal(
      table.headers.objectAt(1).text.trim(),
      'Member 2 (Asia/Ho_Chi_Minh)',
      'Member 2 is listed'
    );

    await click('[data-test-checkbox=collapsed]');

    assert.equal(table.headers.length, 2, 'Table has two columns');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (America/Montevideo)',
      'Member 1 is listed'
    );
    assert.equal(
      table.headers.objectAt(1).text.trim(),
      'Member 2 (Asia/Ho_Chi_Minh)',
      'Member 2 is listed'
    );
  });

  test('Opens google calendar when clicking time box and closes it', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);
    await click('.timezone-list__selected');

    const calendarPopverLabel = find('.google-calendar-popover__label');
    const calendarPopoverButton = find('.google-calendar-popover__button');

    assert.dom('.google-calendar-popover').exists('Calendar popover exists');
    assert.equal(calendarPopverLabel.textContent.trim(), 'Schedule event on Google Calendar', 'Correct label');
    assert.equal(calendarPopoverButton.textContent.trim(), 'Schedule now', 'Correct button text');
  })

  test('Schedule event in google calendar', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });
    setSession.call(this, newUser);

    const calendarBase = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Team Team scheduled event&';
    const timeNow = moment();
    const timeFormat = `${timeNow.year()}${timeNow.format('MM')}${timeNow.format('DD')}`;

    const startHour = timeNow.clone().format('HH');
    const endHour = timeNow.clone().add(1, 'hours').format('HH');

    const calendarDate = `dates=${timeFormat}T${startHour}0000/${timeFormat}T${endHour}0000`;
    const calendarUrl = `${calendarBase}${calendarDate}`;

    await visit(`/teams/${newTeam.id}`);

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
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);

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

  test('Selected index resets on team change', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let team_1 = this.server.create('team', { name: 'Team 1', user: newUser });
    let team_2 = this.server.create('team', { name: 'Team 2', user: newUser });
    setSession.call(this, newUser);

    await visit(`/teams/${team_1.id}`);

    const timezoneHours = findAll('.timezone-list__hour');
    const selectedIndex = 2 + timezoneHours.findIndex(
      (h => h.classList.contains('timezone-list__selected'))
    );

    await click(timezoneHours[selectedIndex]);
    await click(findAll('.team-list__button')[1]);

    assert.equal(currentURL(), `/teams/${team_2.id}`, 'Verifies team change');

    const selectedTimeBox = find('.timezone-list__selected');
    const newTimezoneHours = findAll('.timezone-list__hour');
    const timezoneDetail = find('.timezone-list__details');

    const time = moment.tz('America/Montevideo').startOf('hour');
    const details = time.format('dddd, DD MMMM YYYY, HH:mm');
    const currentTime = time.format('HH.mm');
    const resetedSelectedIndex = newTimezoneHours.findIndex(
      (h => h.classList.contains('timezone-list__selected'))
    );

    assert.notEqual(resetedSelectedIndex, selectedIndex, 'Resets selected index');
    assert.ok(timezoneDetail.textContent.includes(details), 'Correct date details');
    assert.equal(selectedTimeBox.textContent.trim(), currentTime, 'Correct selected time');
  })
});
