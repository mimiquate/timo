import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { compareMemberTimeZones, splitTimezone } from 'timo-frontend/utils/timezone-functions'

module('Unit | Utils | timezone functions', function (hooks) {
  setupTest(hooks);

  test('Compare timezones', function (assert) {
    const memberSmallerTZ = {
      city: {
        timezone: "America/Los_Angeles"
      }
    };
    const memberBiggerTZ =  {
      city: {
        timezone: "America/Montevideo"
      }
    };

    assert.ok(compareMemberTimeZones(memberBiggerTZ, memberSmallerTZ) > 0);
    assert.ok(compareMemberTimeZones(memberSmallerTZ, memberBiggerTZ) < 0);
    assert.equal(compareMemberTimeZones(memberBiggerTZ, memberBiggerTZ), 0);
  });

  test('Split current timezone', function (assert) {
    const timezone = "America/Montevideo"
    const expected = "America, Montevideo"

    const splitedTimezones = splitTimezone(timezone);

    assert.equal(splitedTimezones, expected, "Correct text");
  })

  test('Split complex timezone', function (assert) {
    const timezone = "America/Argentina/Buenos_Aires"
    const expected = "America, Argentina, Buenos Aires"

    const splitedTimezones = splitTimezone(timezone);

    assert.equal(splitedTimezones, expected, "Correct text");
  })
});
