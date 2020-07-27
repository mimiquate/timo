import Component from '@glimmer/component';
import copyTextToClipboard from 'timo-frontend/utils/copy-text-to-clipboard';
import { computed, action } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default class ShareMenuComponent extends Component {
  @computed('args.team.{public,share_id}')
  get disablePublic() {
    return !this.args.team.public || isEmpty(this.args.team.share_id);
  }

  @action
  copyLink() {
    const { protocol, host } = window.location;
    const path = `/p/team/${this.args.team.share_id}`;
    const url = `${protocol}//${host}${path}`;

    copyTextToClipboard(url);
  }

  @action
  async setPublic(value) {
    this.args.team.public = value;
    await this.args.team.save();
  }
}
