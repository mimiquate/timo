import Model, { attr } from '@ember-data/model';

export default class CityModel extends Model {
  @attr('string') name;
  @attr('string') timezone;
  @attr('string') country;

  get fullName() {
    return `${this.name}, ${this.country}`;
  }
}