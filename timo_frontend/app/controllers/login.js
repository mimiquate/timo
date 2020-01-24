import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  router: service(),
  session: service(),

  getIn: action(async function (event) {
    event.preventDefault();

    let { username } = this;
    let user = this.store.createRecord('user', { username });

    await user.save()
    await this.router.transitionTo('landing');
  }),
});