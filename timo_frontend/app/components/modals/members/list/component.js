import Component from "@glimmer/component";
import { action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Changeset } from 'ember-changeset';
import memberValidator from 'timo-frontend/validators/member';
import lookupValidator from 'ember-changeset-validations';
import { fadeOut, fadeIn } from 'ember-animated/motions/opacity';
import { isPresent } from '@ember/utils';
import moment from 'moment';

export default class MemberModalComponent extends Component {
  @tracked showList = true;
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
  showEdit(member) {
    const changeset = Changeset(member, lookupValidator(memberValidator), memberValidator);

    this.memberChangeset = changeset;
    this.showList = false;
    this.cleanErrors();
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
  changeTimezone(value) {
    this.memberChangeset.timezone = value;

    if (isPresent(value)) {
      this.cleanError('timezoneError');
    }
  }

  @action
  async updateMember() {
    this.cleanErrors();
    const changeset = this.memberChangeset;

    await changeset.validate();

    if (changeset.isValid) {
      changeset.save();
      this.closeEdit();
    } else {
      this.showErrors(changeset.errors);
    }
  }
}
