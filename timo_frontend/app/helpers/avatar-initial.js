import { helper } from '@ember/component/helper';

export default helper(function ([name]) {
  return name.charAt(0).toUpperCase();
});
