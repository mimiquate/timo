import {
  validatePresence,
  validateLength,
  validateFormat,
  validateConfirmation
} from 'ember-changeset-validations/validators';


export function loginValidator() {
  return {
    username: [
      validatePresence(true),
      validateLength({ min: 4 , message: 'Username must have at least 4 characters'})
    ],
    password: [
      validatePresence(true),
    ],
  }
}

export function signUpValidator() {
  return {
    username: [
      validatePresence(true),
      validateLength({ min: 4 , message: 'Username must have at least 4 characters'})
    ],
    email: [
      validatePresence(true),
      validateFormat({ type: 'email' })
    ],
    password: [
      validatePresence(true),
      validateLength({ min: 8, message: 'Password must have at least 8 characters'})
    ],
    passwordConfirmation: [
      validatePresence(true),
      validateConfirmation({ on: 'password' })
    ]
  }
}
