import { helper } from '@ember/component/helper';

export default helper(function (rowMeta) {
  return rowMeta[0]['index'];
});