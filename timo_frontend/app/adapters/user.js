import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this._super(...arguments)}/me`;
    }

    return this._super(...arguments);
  },

  deleteSession() {
    const url = `${this.buildURL('')}/logout`;
    return this.ajax(url, 'DELETE');
  },

  verifyEmail(token) {
    const url = this.buildURL('') + "/verify";
    return this.ajax(
      url,
      'GET',
      {
        data: {
          token: token
        }
      }
    );
  }
});