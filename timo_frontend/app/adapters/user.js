import ApplicationAdapter from './application';

export default class UserAdapter extends ApplicationAdapter {
  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${super.urlForQueryRecord(...arguments)}/me`;
    }

    return super.urlForQueryRecord(...arguments);
  }

  deleteSession() {
    const url = `${this.buildURL('')}/logout`;
    return this.ajax(url, 'DELETE');
  }
}