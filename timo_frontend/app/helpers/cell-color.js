import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function (params) {
  const time = params[0];
  let retClass = ''

  // Checks if time is not undefined,
  // rendering issues causes this problem
  if (time) {
    const hour = moment(time).hours();

    if (hour >= 8 && hour <= 17) {
      retClass = 'green';
    } else if (hour >= 18 && hour <= 21) {
      retClass = 'yellow';
    } else {
      retClass = 'red';
    }
  }

  return retClass;
});
