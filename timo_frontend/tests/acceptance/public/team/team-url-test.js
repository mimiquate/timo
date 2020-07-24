import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { TablePage } from 'ember-table/test-support';
import moment from 'moment';
import { setupWindowMock } from 'ember-window-mock/test-support';
import window from 'ember-window-mock';

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

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (Universal)',
      'Member 1 is listed'
    );

    await click('[data-test-checkbox=current]');
    assert.equal(table.headers.length, 2, 'Table has two columns');

    await click('[data-test-checkbox=current]');
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

    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'Member 1 (America/Montevideo)',
      'Member 1 is listed'
    );

    await click('[data-test-checkbox=current]');
    assert.equal(table.headers.length, 1, 'Table has one column');

    await click('[data-test-checkbox=current]');
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

    await visit(`/p/team/${newTeam.share_id}`);

    assert.equal(table.headers.length, 0, 'Table has no column');

    await click('[data-test-checkbox=current]');
    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      'You (America/Montevideo) Current timezone',
      'Current timezone is listed'
    );

    await click('[data-test-checkbox=current]');
    assert.equal(table.headers.length, 0, 'Table has no column');
  });

  test('Collapse table checkbox disable if no members', async function (assert) {
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

    assert.dom('[data-test-checkbox=collapsed]').exists('Collapse table checkbox exists');
    assert.dom('[data-test-checkbox=collapsed]').hasText('Collapse table', 'Correct text');

    const collapsedCheckbox = assert.dom('[data-test-checkbox=collapsed]').findTargetElement();
    assert.equal('disabled', collapsedCheckbox.attributes.disabled.value, 'Checkbox is disabled');
  });

  test('Collapse table checkbox disable if only one member', async function (assert) {
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

    await visit(`/p/team/${newTeam.share_id}`);

    assert.dom('[data-test-checkbox=collapsed]').exists('Collapse table checkbox exists');
    assert.dom('[data-test-checkbox=collapsed]').hasText('Collapse table', 'Correct text');

    const collapsedCheckbox = assert.dom('[data-test-checkbox=collapsed]').findTargetElement();
    assert.equal('disabled', collapsedCheckbox.attributes.disabled.value, 'Checkbox is disabled');
  });

  test('Collapse table checkbox enable if there are at least 2 members', async function (assert) {
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
      timezone: 'America/Los_Angeles',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

    assert.dom('[data-test-checkbox=collapsed]').exists('Collapse table checkbox exists');
    assert.dom('[data-test-checkbox=collapsed]').hasText('Collapse table', 'Correct text');

    const collapsedCheckbox = assert.dom('[data-test-checkbox=collapsed]').findTargetElement();
    assert.notOk(collapsedCheckbox.attributes.disabled, 'Checkbox is enabled');
  });

  test('Collapse member into another', async function (assert) {
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
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

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
      timezone: 'America/Montevideo',
      team: newTeam
    });
    this.server.create('member', {
      name: 'Member 3',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/p/team/${newTeam.share_id}`);

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

  test('Opens google calendar when clicking row', async function (assert) {
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

    const calendarBase = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Team Team scheduled event&';
    const timeNow = moment();
    const timeFormat = `${timeNow.year()}${timeNow.format('MM')}${timeNow.format('DD')}`;
    const calendarDate = `dates=${timeFormat}T060000/${timeFormat}T070000`;
    const calendarUrl = `${calendarBase}${calendarDate}`;

    await visit(`/p/team/${newTeam.share_id}`);

    window.open = (urlToOpen) => {
      assert.equal(
        urlToOpen,
        calendarUrl,
        'Correct google calendar link'
      );
    };

    await click('[data-test-row="6"]');
  });
});