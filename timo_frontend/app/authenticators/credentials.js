import Base from "ember-simple-auth/authenticators/base";
import fetch from 'fetch';

export default Base.extend({
  async restore(data) {
    return data;
  },

  async authenticate(username, password) {
    let response = await fetch(
      '/api/session',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    if (!response.ok) {
      let error = await response.json();
      throw error;
    }

    return response;
  }
})