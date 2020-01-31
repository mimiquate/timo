import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from "@ember/object";

export default Controller.extend({
  session: service(),

  actions: {
    saveTeam() {

    },

    setValue(value) {
      set(this, 'teamName', value);
    }
  }
});
