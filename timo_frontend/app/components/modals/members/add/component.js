import Component from "@glimmer/component";
import { action, set } from '@ember/object';
import { Changeset } from 'ember-changeset';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { showErrors, cleanErrors } from 'timo-frontend/utils/errors-handler'
import memberValidator from 'timo-frontend/validators/member';
import lookupValidator from 'ember-changeset-validations';
import moment from 'moment';

export default class AddMemberModalComponent extends Component {
  @tracked name = '';
  @tracked timezone = '';
  @tracked nameError = '';
  @tracked timezoneError = '';
  @tracked selectedCity = null;

  timezoneList = moment.tz.names();

  @action
  cleanError(error) {
    set(this, error, '');
  }

  @action
  changeTimezone(value) {
    this.timezone = value;
    this.selectedCity = null;

    if (isPresent(value)) {
      this.cleanError('timezoneError');
    }
  }

  @action
  async add(event) {
    event.preventDefault();

    const errors = ['nameError', 'timezoneError'];
    cleanErrors.call(this, errors);

    const name = this.name.trim();
    const timezone = this.timezone;
    const city = this.selectedCity;

    let changeset = Changeset({
      name,
      timezone
    }, lookupValidator(memberValidator), memberValidator);

    await changeset.validate();

    if (changeset.isValid) {
      this.args.addNewMember(name, timezone, city);
    } else {
      showErrors.call(this, changeset.errors);
    }
  }

  @action
  changeCity(city) {
    this.selectedCity = city;
    this.timezone = city.timezone;

    if (isPresent(city)) {
      this.cleanError('timezoneError');
    }
  }
}
