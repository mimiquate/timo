import { click, fillIn } from "@ember/test-helpers";

export async function tryLogin(username) {
  await fillIn('#username-input input', username);
  return click('[data-test-rr=login-button]');
}