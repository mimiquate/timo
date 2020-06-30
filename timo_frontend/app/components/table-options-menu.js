import Component from '@ember/component';
import copyTextToClipboard from 'timo-frontend/utils/copy-text-to-clipboard';
import { set, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  disablePublic: computed('team.{public,share_id}', function () {
    return !this.team.public || isEmpty(this.team.share_id);
  }),

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