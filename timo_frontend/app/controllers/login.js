import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  showErrors: false,

  router: service(),
  session: service(),

  actions: {
    async getIn(event) {
      event.preventDefault();
  
      let { username } = this;
      if (!username) {
        this.send('setError');
      } else {
        let user = this.store.createRecord('user', { username });
        await user.save()
        await this.router.transitionTo('landing');
      }
    },
  
    setError() {
      this.set('showErrors', true)
    },
  
    resetError() {
      this.set('showErrors', false);
    }
  }
});