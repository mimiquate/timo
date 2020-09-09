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
  await fillIn('#teamName-input input', teamName);
  return click('[data-test-new-team=save]');
}

export async function chooseTimeZone(timezone) {
  await clickTrigger('#memberTimeZone-select');
  return selectChoose('#memberTimeZone-select', timezone);
}

export async function openNewMemberModal(teamId) {
  await visit(`/teams/${teamId}`);
  return click('[data-test=add-member-button]');
}

export async function signUp(username, password, confirm, email) {
  await fillIn('#username-input input', username);
  await fillIn('#password-input input', password);
  await fillIn('#confirmPassword-input input', confirm);
  await fillIn('#email-input input', email);
  return click('[data-test=sign-up-button]');
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
