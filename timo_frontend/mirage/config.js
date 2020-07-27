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
  this.patch('/teams/:id', function ({ teams }, request) {
    let { data } = JSON.parse(request.requestBody);
    let team = teams.findBy({ id: data.id });
    let public_flag = data.attributes.public;
    let share_id = public_flag ? 'yjHktCOyBDTb' : null;

    return team.update({
      share_id: share_id,
      public: public_flag
    })
  }, 200);
  this.delete('/teams/:id');
}