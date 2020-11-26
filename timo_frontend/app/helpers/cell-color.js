import { helper } from '@ember/component/helper';

export default helper(function (params) {
  const time = params[0];
  const hour = time.hours();

  if (hour > 9 && hour < 18) {
    return 'green';
  } else if (hour < 8 || hour > 19) {
    return 'red';
  } else {
    return 'blue';
  }
});
