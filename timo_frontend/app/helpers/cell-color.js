import { helper } from '@ember/component/helper';

export default helper(function (params) {
  const time = params[0];

  // Checks if time is not undefined,
  // rendering issues causes this problem
  if (time) {
    const hour = time.match(/\d\d(?=:)/);

    if (hour >= 8 && hour <= 17) {
      return 'green';
    }

    if (hour >= 18 && hour <= 21) {
      return 'yellow';
    }

    return 'red';
  }

  return '';
});
