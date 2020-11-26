import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, ignoreBlank: true }),
  ],
  timezone: [
    validatePresence({ presence: true, ignoreBlank: true }),
  ],
}
