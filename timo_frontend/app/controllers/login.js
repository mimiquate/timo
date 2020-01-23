import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  router: service(),

  getIn: action(async function (event) {
    event.preventDefault();

    let { username } = this;
    if (username) {
      this.router.transitionTo('landing');
    } 
    // else {
    //   let user = this.store.createRecord('user', { username });
    //   await user.save()
    //   await this.router.transitionTo('landing');
    // }
  }),
});