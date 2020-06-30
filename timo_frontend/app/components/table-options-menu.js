import Component from '@ember/component';
import copyTextToClipboard from 'timo-frontend/utils/copy-text-to-clipboard';
import { set } from "@ember/object";

export default Component.extend({
  actions: {
    copyLink() {
      const { protocol, host } = window.location;
      const path = `/p/team/${this.team.share_id}`;
      const url = `${protocol}//${host}${path}`;

      copyTextToClipboard(url);
    },

    async setPublic(value) {
      set(this.team, 'public', value);
      await this.team.save();
    }
  }
});