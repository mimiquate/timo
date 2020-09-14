import { click, fillIn, visit, findAll } from '@ember/test-helpers';
import { clickTrigger, selectChoose } from 'ember-power-select/test-support/helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

export async function loginAs(username, password) {
  const inputs = findAll('.login-page__input input');

  await fillIn(inputs[0], username);
  await fillIn(inputs[1], password);
  return click('.login-page__log-in-button');
}

export function setSession(user) {
  const currentUser = this.owner.lookup('service:current-user');
  currentUser.setCurrentUser(user);
  authenticateSession();
}

export async function createTeam(teamName) {
  await click('[data-test=new-team]');
  await fillIn('.t-modal__team-name input', teamName);
  return click('[data-test=save-button]');
}

export async function chooseTimeZone(timezone) {
  await clickTrigger('.t-dropdown');
  return selectChoose('.t-dropdown', timezone);
}

export async function openNewMemberModal(teamId) {
  await visit(`/teams/${teamId}`);
  return click('[data-test=add-member-button]');
}

export async function signUp(username, password, passwordConfirmation, email) {
  const inputs = findAll('.sign-up-page__input input');

  await fillIn(inputs[0], username);
  await fillIn(inputs[1], email);
  await fillIn(inputs[2], password);
  await fillIn(inputs[3], passwordConfirmation);

  return click('.sign-up-page__log-in-button');
}

export function invalidUserServerPost() {
  this.server.post('/session',
    {
      errors: [{
        detail: 'User doesn\'t exists or incorrect password',
        status: '400',
        title: 'Invalid username or password'
      }]
    },
    400
  );
}
