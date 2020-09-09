import { validatePresence, validateLength } from 'ember-changeset-validations/validators';

export default {
  username: [
    validatePresence(true),
    validateLength({ min: 4 , message: 'Username must have at least 4 characters'})
  ],
  password: [
    validatePresence(true),
    validateLength({ min: 8, message: 'Password must have at least 8 characters'}),
  ],
};
