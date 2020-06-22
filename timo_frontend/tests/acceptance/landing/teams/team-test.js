import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setSession } from 'timo-frontend/tests/helpers/custom-helpers';
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
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

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
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
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
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await visit(`/teams/${newTeam.id}`);
    await click('[data-test=add-member-button]');

    assert.dom('[data-test=new-member-modal]').exists('Correctly opens new member modal');
    assert.dom('[data-test=member-modal-title]').exists('New member modal title loads');
    assert.dom('[data-test=member-modal-title]').hasText('New Member', 'Correct title');
  });

  test('Clicks checkbox lists my current timezone', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
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

    await click('[data-test-checkbox=current]');
    assert.equal(table.headers.length, 2, 'Table has two columns');

    await click('[data-test-checkbox=current]');
    assert.equal(table.headers.length, 1, 'Table has one column');
  });

  test('Clicks checkbox with already existing current timezone', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);

    const table = new TablePage();

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
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });

    await visit(`/teams/${newTeam.id}`);

    const table = new TablePage();

    assert.equal(table.headers.length, 0, 'Table has no column');

    await click('[data-test-checkbox=current]');
    assert.equal(table.headers.length, 1, 'Table has one column');
    assert.equal(
      table.headers.objectAt(0).text.trim(),
      `You (America/Montevideo) Current timezone`,
      'Current timezone is listed'
    );

    await click('[data-test-checkbox=current]');
    assert.equal(table.headers.length, 0, 'Table has no column');
  });

  test('Clicks member in table to edit it', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    setSession.call(this, newUser);
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    let newMember = this.server.create('member', {
      name: 'Member 1',
      timezone: 'America/Montevideo',
      team: newTeam
    });

    await visit(`/teams/${newTeam.id}`);

    new TablePage();

    await click(`[data-test-member="${newMember.id}"]`);

    assert.dom('[data-test=edit-member-modal]').exists('Correctly opens edit member modal');
    assert.dom('[data-test=member-modal-title]').exists('Edit member modal title loads');
    assert.dom('[data-test=member-modal-title]').hasText('Edit Member', 'Correct title');
    assert.dom('#memberName-input input').hasValue('Member 1', 'Member name is there');
    assert.dom('#memberTimeZone-select .ember-power-select-selected-item')
      .hasText('America/Montevideo', 'Member timezone is there');
  });

  test('Clicks share icon', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser, public: false });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);
    await click('[data-test=share-icon]');

    assert.dom('[data-test=public-share-item]').hasText('Public Access', 'Modal has content');
    assert.dom('[data-test=public-checkbox]').exists('Checkbox exists');
    assert.dom('[data-test=copy-link-button]').exists('Copy link button exists');
    assert.dom('[data-test=copy-link-button]').hasText('Copy Link', 'Button has correct text');
  });

  test('Clicks share icon', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser, public: false });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);
    await click('[data-test=share-icon]');
    await click('[data-test=public-checkbox]');

    assert.equal(newTeam.public, true, 'Changes view to public');

    await click('[data-test=public-checkbox]');

    assert.equal(newTeam.public, false, 'Changes view to not public');
  });

  test('Collapse table checkbox disable if no members', async function (assert) {
    let newUser = this.server.create('user', { username: 'juan' });
    let newTeam = this.server.create('team', { name: 'Team', user: newUser });
    setSession.call(this, newUser);

    await visit(`/teams/${newTeam.id}`);

    assert.dom('[data-test-checkbox=collapsed]').exists('Collapse table checkbox exists');
    assert.dom('[data-test-checkbox=collapsed]').hasText('Collapse table', 'Correct text');

    const collapsedCheckbox = assert.dom('[data-test-checkbox=collapsed]').findTargetElement();
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

    const collapsedCheckbox = assert.dom('[data-test-checkbox=collapsed]').findTargetElement();
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

    const collapsedCheckbox = assert.dom('[data-test-checkbox=collapsed]').findTargetElement();
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

    const table = new TablePage();

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

    const table = new TablePage();

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

    const table = new TablePage();

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
});