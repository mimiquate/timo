import { helper } from '@ember/component/helper';

export default helper(function (params) {
  const collapsedMembersCount = params[0];
  let ret = "";

  if (collapsedMembersCount === 2) {
    ret = "+ 1 member";
  }

  if (collapsedMembersCount > 2) {
    ret = `+ ${collapsedMembersCount - 1} members`;
  }

  return ret;
});
