import Component from "@glimmer/component";
import moment from 'moment';
import { action, set } from '@ember/object';
import { Changeset } from 'ember-changeset';
import memberValidator from 'timo-frontend/validators/member';
import lookupValidator from 'ember-changeset-validations';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { showErrors, cleanErrors } from 'timo-frontend/utils/errors-handler'

export default class MemberModalComponent extends Component {
  @tracked name = '';
  @tracked timezone = '';
  @tracked nameError = '';
  @tracked timezoneError = '';

  timezoneList = moment.tz.names();

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
  async add(e) {
    e.preventDefault();
    const errors = ['nameError', 'timezoneError'];
    cleanErrors.call(this, errors);

    const name = this.name.trim();
    const timezone = this.timezone;

    let changeset = Changeset({
      name,
      timezone
    }, lookupValidator(memberValidator), memberValidator);

    await changeset.validate();

    if (changeset.isValid) {
      this.args.addOrUpdateMember(name, timezone);
    } else {
      showErrors.call(this, changeset.errors);
    }
  }
}
