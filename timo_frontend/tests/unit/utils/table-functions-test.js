import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { compareTimeZones, filterClass, hoursLeftOver } from 'timo-frontend/utils/table-functions'

module('Unit | Utils | table functions', function (hooks) {
  setupTest(hooks);

  test('Compare timezones', function (assert) {
    const memberSmallerTZ = { timezone: "America/Los_Angeles" };
    const memberBiggerTZ = { timezone: "America/Montevideo" };

    assert.equal(compareTimeZones(memberBiggerTZ, memberSmallerTZ), 1);
    assert.equal(compareTimeZones(memberSmallerTZ, memberBiggerTZ), -1);
    assert.equal(compareTimeZones(memberBiggerTZ, memberBiggerTZ), 0);
  });

  test('Hours left over', function (assert) {
    const memberSmallerTZ = { timezone: "America/Los_Angeles" };
    const memberBiggerTZ = { timezone: "America/Montevideo" };
    const membersArray = [memberSmallerTZ, memberBiggerTZ]

    const ret = hoursLeftOver(membersArray, new Date(2020, 3, 18, 15));

    assert.equal(ret[0], 0, 'Initial left over');
    assert.equal(ret[1], 4, 'Final left over');
  });

  test('Filter class', function (assert) {
    const hour = 12;
    const lesserHour = 10;
    const offSet = 1;
    const NoOffSet = 0;

    assert.equal(filterClass(hour, offSet, hour), 'row-past-time');
    assert.equal(filterClass(hour, NoOffSet, hour), 'row-current-time');
    assert.equal(filterClass(hour, offSet, lesserHour), '');
  });
});