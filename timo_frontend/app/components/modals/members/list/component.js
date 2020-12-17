import Component from "@glimmer/component";
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Changeset } from 'ember-changeset';
import { fadeOut, fadeIn } from 'ember-animated/motions/opacity';
import { isPresent } from '@ember/utils';
import { showErrors, cleanErrors } from 'timo-frontend/utils/errors-handler'
import memberValidator from 'timo-frontend/validators/member';
import lookupValidator from 'ember-changeset-validations';
import moment from 'moment';

export default class ListMembersModalComponent extends Component {
  @tracked showList = true;
  @tracked showDeleteConfirmation = false;
  @tracked memberToEdit = null;
  @tracked name = '';
  @tracked timezone = '';
  @tracked nameError = '';
  @tracked timezoneError = '';
  @tracked memberChangeset = null;

  timezoneList = moment.tz.names();

  *transition({ insertedSprites, removedSprites }) {
    yield insertedSprites.forEach(fadeIn);
    yield removedSprites.forEach(fadeOut);
  }

  @action
  showEdit(member) {
    const changeset = Changeset(member, lookupValidator(memberValidator), memberValidator);
    const errors = ['nameError', 'timezoneError'];

    this.memberChangeset = changeset;
    this.showList = false;
    cleanErrors.call(this, errors);
  }

  @action
  closeEdit() {
    this.memberChangeset = null;
    this.showList = true;
  }

  @action
  cleanError(error) {
    set(this, error, '');
  }

  @action
  openDeleteConfirmation() {
    this.showDeleteConfirmation = true;
  }

  @action
  closeDeleteConfirmation() {
    this.showDeleteConfirmation = false;
  }

  @action
  changeTimezone(value) {
    this.memberChangeset.timezone = value;
    this.memberChangeset.city = null;

    if (isPresent(value)) {
      this.cleanError('timezoneError');
    }
  }

  @action
  async updateMember(event) {
    event.preventDefault();

    const errors = ['nameError', 'timezoneError'];
    cleanErrors.call(this, errors);

    const changeset = this.memberChangeset;

    await changeset.validate();

    if (changeset.isValid) {
      changeset.save();
      this.closeEdit();
    } else {
      showErrors.call(this, changeset.errors);
    }
  }

  @action
  deleteMember(member) {
    member.destroyRecord();
  }

  @action
  changeCity(city) {
    this.memberChangeset.city = city;
    this.memberChangeset.timezone = city.timezone;

    if (isPresent(city)) {
      this.cleanError('timezoneError');
    }
  }

  @action
  onInputCity(text) {
    return text.length > 2;
  }
}
