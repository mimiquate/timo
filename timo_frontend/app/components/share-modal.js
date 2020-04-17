import Component from '@ember/component';
import copyTextToClipboard from 'timo-frontend/utils/copy-text-to-clipboard';

export default Component.extend({
  actions: {
    copyLink() {
      const { protocol, host } = window.location;
      const path = "/p/team/" + this.team.share_id;
      const url = `${protocol}//${host}${path}`;

      copyTextToClipboard(url);
    }
  }
});
