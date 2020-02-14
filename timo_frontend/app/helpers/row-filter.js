import { helper } from '@ember/component/helper';

export default helper(function (params) {
  const cssClass = params[0]['filter'];
  return cssClass;
});
