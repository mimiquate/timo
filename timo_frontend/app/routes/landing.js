import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
    cookies: service(),
    session: service(),

    async beforeModel() {
        let user = await this.store.queryRecord('user', { me: true });
        this.session.login(user);
    }
});