export default function() {
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
}