import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

module('Integration | Helper | cell-color', function(hooks) {
  setupRenderingTest(hooks);

  test('Returns green when hour is between 8am and 5pm', async function(assert) {
    this.set('inputValue', moment().hour(8));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'First green value');

    this.set('inputValue', moment().hour(14));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'Middle green value');

    this.set('inputValue', moment().hour(17));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'Last green value');
  });

  test('Returns yellow when hour is between 6pm and 9pm', async function(assert) {
    this.set('inputValue', moment().hour(18));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'yellow', 'First yellow value');

    this.set('inputValue', moment().hour(19));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'yellow', 'Middle yellow value');

    this.set('inputValue', moment().hour(21));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'yellow', 'Last yellow value');
  });

  test('Returns red from 10pm to 7am', async function(assert) {
    this.set('inputValue', moment().hour(22));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'First red value');

    this.set('inputValue', moment().hour(3));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'Middle red value');

    this.set('inputValue', moment().hour(7));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'Last red value');
  });

  test('Returns no value when undefined', async function(assert) {
    this.set('inputValue', undefined);
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), '', 'No value');
  });
});
