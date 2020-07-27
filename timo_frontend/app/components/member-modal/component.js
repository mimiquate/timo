import Component from "@glimmer/component";
import moment from 'moment';
import { action } from '@ember/object';
import emptyInput from 'timo-frontend/custom-paper-validators/empty-input';

export default class MemberModalComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    if (this.args.member) {
      this.memberName = this.args.member.name;
      this.memberTimeZone = this.args.member.timezone;
    }
    this.emptyInputValidation = emptyInput;
  }

  timezoneList = moment.tz.names();

  @action
  add() {
    const memberName = this.memberName.trim();
    const memberTimeZone = this.memberTimeZone;

    this.args.addMember(memberName, memberTimeZone);
  }
}
