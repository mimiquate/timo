import { click, fillIn } from "@ember/test-helpers";

export async function tryLogin(username) {
  await fillIn('#username-input input', username);
  return click('[data-test-rr=login-button]');
}

export function setSession(user) {
  const session = this.owner.lookup('service:session');
  session.setCurrentUser(user);
}

export async function tryCreateTeam(teamName) {
  await fillIn('#teamName-input input', teamName);
  return click('[data-test-rr=saveTeam-button]');
}