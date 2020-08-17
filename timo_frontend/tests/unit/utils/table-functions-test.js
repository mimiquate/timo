import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { compareMemberTimeZones, createMemberArray } from 'timo-frontend/utils/table-functions'

module('Unit | Utils | table functions', function (hooks) {
  setupTest(hooks);

  test('Compare timezones', function (assert) {
    const memberSmallerTZ = { timezone: "America/Los_Angeles" };
    const memberBiggerTZ = { timezone: "America/Montevideo" };

    assert.equal(compareMemberTimeZones(memberBiggerTZ, memberSmallerTZ), 1);
    assert.equal(compareMemberTimeZones(memberSmallerTZ, memberBiggerTZ), -1);
    assert.equal(compareMemberTimeZones(memberBiggerTZ, memberBiggerTZ), 0);
  });

  test('Create members array', function (assert) {
    const array = [
      { name: "Member 1", timezone: "America/Montevideo", id: 1},
      { name: "Member 2", timezone: "America/Buenos_Aires", id: 2}
    ];
    let timezoneNow = "America/Montevideo";

    let membersArray = createMemberArray(array, false, timezoneNow);
    assert.deepEqual(array, membersArray, 'Show current is false, no changes');

    membersArray = createMemberArray(array, true, timezoneNow);
    assert.deepEqual(array, membersArray, 'Already exists member with current timezone, no changes');

    timezoneNow = "America/Los_Angeles";
    membersArray = createMemberArray(array, true, timezoneNow);
    let newMember = membersArray[2];
    assert.notEqual(array, membersArray, 'Current timezone doesnt exists');
    assert.equal(membersArray.length, 3, 'Added new member');
    assert.equal(newMember.name, "You", 'Correct name');
    assert.equal(newMember.timezone, "America/Los_Angeles", 'Correct timezone');
    assert.equal(newMember.id, "current", 'Correct id');
  });
});