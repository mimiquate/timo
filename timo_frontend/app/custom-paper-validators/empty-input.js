import { isPresent } from '@ember/utils';

export default [{
  message: 'This is required.',
  validate: (inputValue) => isPresent(inputValue)
}]