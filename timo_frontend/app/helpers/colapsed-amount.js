import { helper } from '@ember/component/helper';

export default helper(function (params) {
  const colapsedAmount = params[0];
  let ret = "";

  if (colapsedAmount === 1) {
    ret = "+ 1 member";
  }

  if (colapsedAmount > 1) {
    ret = `+ ${colapsedAmount} members`;
  }

  return ret;
});
