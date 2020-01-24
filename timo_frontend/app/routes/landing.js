import Route from '@ember/routing/route';
import {inject as service } from '@ember/service';

export default Route.extend({
    cookies: service(),
    session: service(),

    async beforeModel() {
        // let cookieService = this.cookies;
        // if (cookieService.exists('_timo_key')) {
            let user = await this.store.queryRecord('user', { me: true });
            this.session.login(user);
        // }
    }
});