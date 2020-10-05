import Component from '@glimmer/component';

export default class TeamHeaderComponent extends Component {
  get membersLabel() {
    const members = this.args.members.length;

    return members > 1 ? `${members} Members` : `${members} Member`
  }
}
