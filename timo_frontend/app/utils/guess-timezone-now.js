import moment from 'moment';
import ENV from 'timo-frontend/config/environment';

export default function guessTimezoneNow() {
  if (ENV.environment === 'test') {
    return 'America/Montevideo';
  }

  return moment.tz.guess(true);
}