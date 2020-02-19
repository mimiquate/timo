import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from '../../../helpers/custom-helpers';
import { TablePage } from 'ember-table/test-support';
import moment from 'moment';

module('Acceptance | Team', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Visiting /teams/team without exisiting username', async function (assert) {
    await visit('/teams/team');

    assert.equal(currentURL(), '/login', 'Correctly redirects to login page');
  });

  test('Visiting /teams/team with existing username and no members', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}`);

    assert.equal(currentURL(), `/teams/${newTeam.id}`, 'Correctly visits team page');
    assert.dom('[data-test=team-title]').exists('New team title page loads');
    assert.dom('[data-test=team-title]').hasText('Team', 'Correct title');
    assert.dom('[data-test=no-member]')
      .hasText('No members in this team', 'Doesn\'t load members');
  });

  test('Visiting /teams/team with existing username and members', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});
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

  test('Visiting /teams/team with members sorted', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});
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

    await visit(`/teams/${newTeam.id}`);

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

  test('Clicks button to add member', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    await visit(`/teams/${newTeam.id}`);
    await click('[data-test=add-member-button]');

    assert.equal(currentURL(), `/teams/${newTeam.id}/new`, 'Correctly visits new member page');
    assert.dom('[data-test=new-member-title]').exists('New member title page loads');
    assert.dom('[data-test=new-member-title]').hasText('New Member', 'Correct title');
  });

  test('Clicks checkbox lists my current timezone', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});
    this.server.create('member', {
      name: 'Member 1',
      timezone: 'Universal',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);

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
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser});

    const timezoneNow = moment.tz.guess(true);
    this.server.create('member', {
      name: 'Member 1',
      timezone: timezoneNow,
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);

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
});