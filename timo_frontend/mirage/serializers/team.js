import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  // eslint-disable-next-line
  include: ['members']
});
