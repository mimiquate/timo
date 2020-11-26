import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import moment from 'moment';

module('Integration | Component | timezone-list-component', function(hooks) {
  setupRenderingTest(hooks);

  const noAction = () => null;
  const selectedTime = moment.tz('America/Montevideo');

  test('Show correct text for one member', async function(assert) {
    this.set('timezone', {
      members: [{
        name: 'Member 1'
      }],
      timezonesList: ['America/Montevideo'],
    });
    this.set('selectedTime', selectedTime);
    this.set('scheduleEvent', noAction);
    this.set('selectBox', noAction);
    this.set('selectedBoxIndex', noAction);
    this.set('scrollAll', noAction);
    this.set('isShowingCalendarPopover', noAction);
    this.set('toggleCalendarPopoverBackground', noAction);
    await render(hbs`
      <TimezoneList::Timezone
        @timezone={{this.timezone}}
        @selectedTime={{this.selectedTime}}
        @scheduleEvent={{this.scheduleEvent}}
        @selectBox={{this.selectBox}}
        @selectedBoxIndex={{this.selectedBoxIndex}}
        @scrollAll={{this.scrollAll}}
        @isShowingCalendarPopover={{this.isShowingCalendarPopover}}
        @toggleCalendarPopoverBackground={{this.toggleCalendarPopoverBackground}}
      />
    `);

    assert.equal(
      find('.timezone-list__members').textContent.trim(),
      'Member 1'
    )
  });

  test('Show correct text for three members', async function(assert) {
    this.set('timezone', {
      members: [
        {
          name: 'Member 1',
        },
        {
          name: 'Member 2',
        },
        {
          name: 'Member 3',
        }
      ],
      timezonesList: ['America/Montevideo'],
    });
    this.set('selectedTime', selectedTime);
    this.set('scheduleEvent', noAction);
    this.set('selectBox', noAction);
    this.set('selectedBoxIndex', noAction);
    this.set('scrollAll', noAction);
    this.set('isShowingCalendarPopover', noAction);
    this.set('toggleCalendarPopoverBackground', noAction);

    await render(hbs`
      <TimezoneList::Timezone
        @timezone={{this.timezone}}
        @selectedTime={{this.selectedTime}}
        @scheduleEvent={{this.scheduleEvent}}
        @selectBox={{this.selectBox}}
        @selectedBoxIndex={{this.selectedBoxIndex}}
        @scrollAll={{this.scrollAll}}
        @isShowingCalendarPopover={{this.isShowingCalendarPopover}}
        @toggleCalendarPopoverBackground={{this.toggleCalendarPopoverBackground}}
      />
    `);

    assert.equal(
      find('.timezone-list__members').textContent.trim(),
      'Member 1, Member 2 and Member 3'
    )
  });

  test('Show correct text for more than 4 members', async function(assert) {
    this.set('timezone', {
      members: [
        {
          name: 'Member 1',
        },
        {
          name: 'Member 2',
        },
        {
          name: 'Member 3',
        },
        {
          name: 'Member 4',
        },
        {
          name: 'Member 5',
        },
        {
          name: 'Member 6',
        },
      ],
      timezonesList: ['America/Montevideo'],
    });
    this.set('selectedTime', selectedTime);
    this.set('scheduleEvent', noAction);
    this.set('selectBox', noAction);
    this.set('selectedBoxIndex', noAction);
    this.set('scrollAll', noAction);
    this.set('isShowingCalendarPopover', noAction);
    this.set('toggleCalendarPopoverBackground', noAction);

    await render(hbs`
      <TimezoneList::Timezone
        @timezone={{this.timezone}}
        @selectedTime={{this.selectedTime}}
        @scheduleEvent={{this.scheduleEvent}}
        @selectBox={{this.selectBox}}
        @selectedBoxIndex={{this.selectedBoxIndex}}
        @scrollAll={{this.scrollAll}}
        @isShowingCalendarPopover={{this.isShowingCalendarPopover}}
        @toggleCalendarPopoverBackground={{this.toggleCalendarPopoverBackground}}
      />
    `);

    assert.equal(
      find('.timezone-list__members').textContent.trim(),
      'Member 1, Member 2, Member 3, Member 4 and 2 more'
    )
  });
});
