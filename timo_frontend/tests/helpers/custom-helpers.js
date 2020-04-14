import { click, fillIn, visit } from "@ember/test-helpers";
import { clickTrigger, selectChoose } from 'ember-power-select/test-support/helpers';
import { authenticateSession } from 'ember-simple-auth/test-support';

export async function loginAs(username, password) {
  await fillIn('#username-input input', username);
  await fillIn('#password-input input', password);
  return click('[data-test=login-button]');
}

export function setSession(user) {
  const currentUser = this.owner.lookup('service:current-user');
  currentUser.setCurrentUser(user);
  authenticateSession();
}

export async function createTeam(teamName) {
  await fillIn('#teamName-input input', teamName);
  return click('[data-test=saveTeam-button]');
}

export async function chooseTimeZone(timezone) {
  await clickTrigger('#memberTimeZone-select');
  return selectChoose('#memberTimeZone-select', timezone);
}

export async function openNewMemberModal(teamId) {
  await visit(`/teams/${teamId}`);
  return click('[data-test=add-member-button]');
}

export async function signUp(username, password, confirm) {
  await fillIn('#username-input input', username);
  await fillIn('#password-input input', password);
  await fillIn('#confirmPassword-input input', confirm);
  return click('[data-test=sign-up-button]');
}