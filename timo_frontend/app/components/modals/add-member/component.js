import Component from "@glimmer/component";
import moment from 'moment';
import { action, set } from '@ember/object';
import { Changeset } from 'ember-changeset';
import memberValidator from 'timo-frontend/validators/member';
import lookupValidator from 'ember-changeset-validations';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';

export default class AddMemberModalComponent extends Component {
  @tracked name = '';
  @tracked timezone = '';
  @tracked nameError = '';
  @tracked timezoneError = '';

  timezoneList = moment.tz.names();

  showErrors(errors) {
    errors.forEach(field => {
      set(this, `${field.key}Error`, field.validation[0]);
    });
  }

  cleanErrors() {
    this.nameError = '';
    this.timezoneError = '';
  }

  @action
  cleanError(error) {
    set(this, error, '');
  }

  @action
  changeTimezone(value) {
    this.timezone = value;

    if (isPresent(value)) {
      this.cleanError('timezoneError');
    }
  }

  @action
  async add() {
    this.cleanErrors();

    const name = this.name.trim();
    const timezone = this.timezone;

    let changeset = Changeset({
      name,
      timezone
    }, lookupValidator(memberValidator), memberValidator);

    await changeset.validate();

    if (changeset.isValid) {
      this.args.addMember(name, timezone);
    } else {
      this.showErrors(changeset.errors);
    }
  }
}
