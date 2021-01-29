import Component from "@glimmer/component";
import { action, set } from '@ember/object';
import { Changeset } from 'ember-changeset';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { showErrors, cleanErrors } from 'timo-frontend/utils/errors-handler'
import memberValidator from 'timo-frontend/validators/member';
import lookupValidator from 'ember-changeset-validations';

export default class AddMemberModalComponent extends Component {
  @tracked name = '';
  @tracked nameError = '';
  @tracked cityError = '';
  @tracked selectedCity = null;

  @action
  cleanError(error) {
    set(this, error, '');
  }

  @action
  async add(event) {
    event.preventDefault();

    const errors = ['nameError', 'cityError'];
    cleanErrors.call(this, errors);

    const name = this.name.trim();
    const city = this.selectedCity;

    let changeset = Changeset({
      name,
      city
    }, lookupValidator(memberValidator), memberValidator);

    await changeset.validate();

    if (changeset.isValid) {
      this.args.addNewMember(name, city);
    } else {
      showErrors.call(this, changeset.errors);
    }
  }

  @action
  changeCity(city) {
    this.selectedCity = city;

    if (isPresent(city)) {
      this.cleanError('cityError');
    }
  }
}
