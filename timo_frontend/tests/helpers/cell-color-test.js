import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

module('Integration | Helper | cell-color', function(hooks) {
  setupRenderingTest(hooks);

  test('Returns green when hour is between 10am and 5pm', async function(assert) {
    this.set('inputValue', moment().hour(10));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'First green value');

    this.set('inputValue', moment().hour(14));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'Middle green value');

    this.set('inputValue', moment().hour(17));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'green', 'Last green value');
  });

  test('Returns blue when hour is 8am or 9am or 6pm or 7pm', async function(assert) {
    this.set('inputValue', moment().hour(8));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'blue', 'First blue value');

    this.set('inputValue', moment().hour(9));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'blue', 'Second blue value');

    this.set('inputValue', moment().hour(18));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'blue', 'Third blue value');

    this.set('inputValue', moment().hour(19));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'blue', 'Last blue value');
  });

  test('Returns red when hour is between 8pm to 7am', async function(assert) {
    this.set('inputValue', moment().hour(20));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'First red value');

    this.set('inputValue', moment().hour(3));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'Middle red value');

    this.set('inputValue', moment().hour(7));
    await render(hbs`{{cell-color inputValue}}`);
    assert.equal(this.element.textContent.trim(), 'red', 'Last red value');
  });
});
