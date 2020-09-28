import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { compareMemberTimeZones, splitTimezone } from 'timo-frontend/utils/table-functions'

module('Unit | Utils | table functions', function (hooks) {
  setupTest(hooks);

  test('Compare timezones', function (assert) {
    const memberSmallerTZ = { timezone: "America/Los_Angeles" };
    const memberBiggerTZ = { timezone: "America/Montevideo" };

    assert.equal(compareMemberTimeZones(memberBiggerTZ, memberSmallerTZ), 1);
    assert.equal(compareMemberTimeZones(memberSmallerTZ, memberBiggerTZ), -1);
    assert.equal(compareMemberTimeZones(memberBiggerTZ, memberBiggerTZ), 0);
  });

  test('Split current timezone', function (assert) {
    const timezone = "America/Montevideo";
    const expected = "America, Montevideo (you)"

    const timezoneSplited = splitTimezone(timezone, timezone);

    assert.equal(timezoneSplited, expected, "Correct text");
  })

  test('Split complex timezone', function (assert) {
    const timezoneNow = "America/Montevideo";
    const timezone = "America/Argentina/Buenos_Aires"
    const expected = "America, Argentina, Buenos Aires"

    const timezoneSplited = splitTimezone(timezone, timezoneNow);

    assert.equal(timezoneSplited, expected, "Correct text");
  })
});