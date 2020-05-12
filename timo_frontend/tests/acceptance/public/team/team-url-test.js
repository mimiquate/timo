import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TablePage } from 'ember-table/test-support';
import moment from 'moment';

module('Acceptance | Public Team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  function setGETTeamsHandler(server) {
    server.get('/teams', function (schema, request) {
      let share_id = request.queryParams['filter[share_id]'];
      let team = schema.teams.findBy({ share_id: share_id, public: true });

      return team;
    }, 200);
  }

  test('Visiting /p/team/:share_id without exisiting team', async function (assert) {
    this.server.post('/teams', { errors: [{ detail: 'Not Found' }] }, 404);
    await visit('/p/team/yjHktCOyBDTb');

    assert.dom('[data-test=team-error]').exists('Visits team page error');
    assert.dom('[data-test=team-error]').hasText('error Team not found', 'Team page error shows error');
  });

  test('Visiting /p/team/:share_id with private team', async function (assert) {
    this.server.post('/teams', { errors: [{ detail: 'Not Found' }] }, 404);
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

    assert.equal(currentURL(), '/p/team/yjHktCOyBDTb', 'Correctly visits Team public page');
    assert.dom('[data-test=team-title]').exists('New team title page loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');
    assert.dom('[data-test=no-member]')
      .hasText('No members in this team', 'Doesn\'t load members');
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

    assert.equal(currentURL(), '/p/team/yjHktCOyBDTb', 'Correctly visits Team public page');
    assert.dom('[data-test=team-title]').exists('Team title loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');

    const table = new TablePage();

    assert.equal(table.headers.length, 2, 'Table has two columns');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (America/Montevideo)',
      'Member 1 is listed'
    );
    assert.equal(
      table.headers.objectAt(1).text.trim(),
      'Member 2 (America/Buenos_Aires)',
      'Member 2 is listed'
    );

    let time = moment().minute(0);
    time.startOf('day');
    let hoursLeft = 24;

    let timeMember1 = moment.tz(time, 'America/Montevideo').format("D MMM YYYY - HH:mm");
    let timeMember2 = moment.tz(time, 'America/Buenos_Aires').format("D MMM YYYY - HH:mm");

    assert.equal(table.getCell(0, 0).text, timeMember1, 'Correct first time in Member 1');
    assert.equal(table.getCell(0, 1).text, timeMember2, 'Correct first time in Member 2');
    assert.equal(table.body.rowCount, hoursLeft, 'Correct number of rows in table');
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
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    const table = new TablePage();

    assert.equal(table.headers.length, 2, 'Table has two columns');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 2 (America/Montevideo)',
      'Member 2 is listed first'
    );
    assert.equal(
      table.headers.objectAt(1).text.trim(),
      'Member 1 (Europe/Rome)',
      'Member 1 is listed second'
    );
  })

  test('Clicks checkbox lists my current timezone', async function (assert) {
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
      timezone: 'Universal',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    const table = new TablePage();

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (Universal)',
      'Member 1 is listed'
    );

    await click('[data-test=checkbox]');
    assert.equal(table.headers.length, 2, 'Table has two columns');

    await click('[data-test=checkbox]');
    assert.equal(table.headers.length, 1, 'Table has one column');
  });

  test('Clicks checkbox with already existing current timezone', async function (assert) {
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

    const timezoneNow = moment.tz.guess(true);
    this.server.create('member', {
      name: 'Member 1',
      timezone: timezoneNow,
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    const table = new TablePage();

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      `Member 1 (${timezoneNow})`,
      'Member 1 is listed'
    );

    await click('[data-test=checkbox]');
    assert.equal(table.headers.length, 1, 'Table has one column');

    await click('[data-test=checkbox]');
    assert.equal(table.headers.length, 1, 'Table has one column');
  });

  test('Clicks checkbox with no members', async function (assert) {
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

    const timezoneNow = moment.tz.guess(true);

    await visit(`/p/team/${newTeam.share_id}`);

    const table = new TablePage();

    assert.equal(table.headers.length, 0, 'Table has no column');

    await click('[data-test=checkbox]');
    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      `You (${timezoneNow}) Current timezone`,
      'Current timezone is listed'
    );

    await click('[data-test=checkbox]');
    assert.equal(table.headers.length, 0, 'Table has no column');
  });
});