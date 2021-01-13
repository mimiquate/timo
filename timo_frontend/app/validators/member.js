import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, ignoreBlank: true }),
  ],
  city: [
    validatePresence({ presence: true, ignoreBlank: true }),
  ],
}
