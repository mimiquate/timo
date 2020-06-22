import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | collapsed-amount', function (hooks) {
  setupRenderingTest(hooks);

  test('Returns + 1 member when there are only two members', async function (assert) {
    this.set('inputValue', 2);
    await render(hbs`Santiago (America/Montevideo) {{collapsed-amount inputValue}}`);
    assert.equal(
      this.element.textContent.trim(),
      'Santiago (America/Montevideo) + 1 member',
      'One member collapsed into another member'
    );
  });

  test('Returns + x members when there are more than two members', async function (assert) {
    this.set('inputValue', 3);
    await render(hbs`Santiago (America/Montevideo) {{collapsed-amount inputValue}}`);
    assert.equal(
      this.element.textContent.trim(),
      'Santiago (America/Montevideo) + 2 members',
      'Two members collapsed into another member'
    );

    this.set('inputValue', 4);
    await render(hbs`Santiago (America/Montevideo) {{collapsed-amount inputValue}}`);
    assert.equal(
      this.element.textContent.trim(),
      'Santiago (America/Montevideo) + 3 members',
      'Three members collapsed into another member'
    );
  });

  test('Returns empty string when there is only one member', async function (assert) {
    this.set('inputValue', 1);
    await render(hbs`Santiago (America/Montevideo) {{collapsed-amount inputValue}}`);
    assert.equal(
      this.element.textContent.trim(),
      'Santiago (America/Montevideo)',
      'No members collapsed into this member'
    );
  });

  test('Returns no value when undefined', async function (assert) {
    this.set('inputValue', undefined);
    await render(hbs`{{collapsed-amount inputValue}}`);
    assert.equal(this.element.textContent.trim(), '', 'No value');
  });
});