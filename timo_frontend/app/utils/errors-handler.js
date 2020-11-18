import { set } from '@ember/object';

export function showErrors(errors) {
  errors.forEach(field => {
    set(this, `${field.key}Error`, field.validation[0]);
  });
}

export function cleanErrors(fields) {
  fields.forEach(field => {
    set(this, field, '');
  })
}
