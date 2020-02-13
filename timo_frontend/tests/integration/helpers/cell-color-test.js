import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | cell-color', function(hooks) {
  setupRenderingTest(hooks);

  test('Returns red when value is incorrect', async function(assert) {
    this.set('inputValue', '1234');

    await render(hbs`{{cell-color inputValue}}`);

    assert.equal(this.element.textContent.trim(), 'red', "Incorrect value");
  });

  test('Returns green when hour is between 8am and 5pm', async function(assert) {
    this.set('inputValue', '2 Feb 2020 - 08:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'First green value');

    this.set('inputValue', '2 Feb 2020 - 16:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'Middle green value');

    this.set('inputValue', '2 Feb 2020 - 17:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'Last green value');
  });

  test('Returns yellow when hour is between 6pm and 9pm', async function(assert) {
    this.set('inputValue', '2 Feb 2020 - 18:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'yellow', 'First yellow value');

    this.set('inputValue', '2 Feb 2020 - 19:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'yellow', 'Middle yellow value');

    this.set('inputValue', '2 Feb 2020 - 21:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'yellow', 'Last yellow value');
  });

  test('Returns red from 10pm to 7am', async function(assert) {
    this.set('inputValue', '3 Feb 2020 - 22:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'First red value');

    this.set('inputValue', '3 Feb 2020 - 03:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'Middle red value');

    this.set('inputValue', '3 Feb 2020 - 07:00');
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'Last red value');
  });

  test('Returns no value when undefined', async function(assert) {
    this.set('inputValue', undefined);
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), '', 'No value');
  });
});
