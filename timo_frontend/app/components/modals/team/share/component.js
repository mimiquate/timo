import Component from "@glimmer/component";
import copyTextToClipboard from 'timo-frontend/utils/copy-text-to-clipboard';
import { computed, action } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';

export default class ShareModalComponent extends Component {
  get title() {
    return `Share "${this.args.team.name}"`;
  }

  get disabledInput() {
    return isEmpty(this.url);
  }

  get url() {
    const { protocol, host } = window.location;
    const shareId = this.args.team.share_id;
    const queryParams = this.args.isGrouped ? '?groupTimezones=true' : '';
    const path = `/p/team/${shareId}${queryParams}`;

    return  isPresent(shareId) ? `${protocol}//${host}${path}` : '';
  }

  @computed('args.team.{public,share_id}')
  get disablePublic() {
    return isEmpty(this.args.team.share_id);
  }

  @action
  togglePopover() {
    this.showToggleablePopover = !this.showToggleablePopover;
  }

  @action
  copyLink() {
    copyTextToClipboard(this.url);
  }

  @action
  async setPublic() {
    this.args.team.public = !this.args.team.public;

    await this.args.team.save();
  }
}
