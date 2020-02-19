import { helper } from '@ember/component/helper';

export default helper(function ([colorClass, isCurrent]) {
  return isCurrent ? colorClass : ''
});
