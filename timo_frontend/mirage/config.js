export default function () {
  // this.urlPrefix == 'http://localhost:4000';
  this.namespace = 'api';

  this.get('/users');
  this.post('/users');
  this.get('/teams');
  this.post('/teams');
  this.get('/teams/:id');
  this.post('/members');
  this.delete('/logout', () => {
    return {};
  }, 200);
  this.get('/members/:id');
  this.patch('/members/:id');
  this.post('/session', function (schema, request) {
    let { username: username, password } =
      JSON.parse(request.requestBody);
    let users = schema.users.where({ username, password });
    if (users.length === 1) {
      return {
        type: "default",
        status: 200,
        ok: true,
        statusText: "OK"
      }
    }
  }, 200);
  this.patch('/teams/:id');
  this.delete('/teams/:id');
}