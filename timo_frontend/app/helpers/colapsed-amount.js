import { helper } from '@ember/component/helper';

export default helper(function (params) {
  const colapsedMembersCount = params[0];
  let ret = "";

  if (colapsedMembersCount === 2) {
    ret = "+ 1 member";
  }

  if (colapsedMembersCount > 2) {
    ret = `+ ${colapsedMembersCount - 1} members`;
  }

  return ret;
});
