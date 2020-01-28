import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	router: service(),

	beforeModel: function () {
		this.router.transitionTo('login');
	}
});