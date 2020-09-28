import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { compareMemberTimeZones } from 'timo-frontend/utils/table-functions'

module('Unit | Utils | table functions', function (hooks) {
  setupTest(hooks);

  test('Compare timezones', function (assert) {
    const memberSmallerTZ = { timezone: "America/Los_Angeles" };
    const memberBiggerTZ = { timezone: "America/Montevideo" };

    assert.equal(compareMemberTimeZones(memberBiggerTZ, memberSmallerTZ), 1);
    assert.equal(compareMemberTimeZones(memberSmallerTZ, memberBiggerTZ), -1);
    assert.equal(compareMemberTimeZones(memberBiggerTZ, memberBiggerTZ), 0);
  });
});