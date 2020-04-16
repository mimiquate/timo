export function initialize(application) {
  application.inject('route', 'currentUser', 'service:current-user');
  application.inject('controller', 'currentUser', 'service:current-user');
}

export default {
  initialize
};
