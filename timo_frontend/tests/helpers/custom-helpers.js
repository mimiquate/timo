import { click, fillIn, visit } from "@ember/test-helpers";
import { clickTrigger, selectChoose } from 'ember-power-select/test-support/helpers';

export async function loginAs(username) {
  await fillIn('#username-input input', username);
  await fillIn('#password-input input', 'password');
  return click('[data-test=login-button]');
}

export function setSession(user) {
  const currentUser = this.owner.lookup('service:current-user');
  currentUser.setCurrentUser(user);
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