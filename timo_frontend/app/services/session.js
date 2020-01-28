import Service from '@ember/service';

export default Service.extend({
    currentUser: null,

    login(user) {
        this.set("currentUser", user)
    },

    logout() {
        this.set("currentUser", null)
    }
});
