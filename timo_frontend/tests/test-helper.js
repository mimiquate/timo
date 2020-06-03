import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import moment from 'moment';

setApplication(Application.create(config.APP));

moment.tz.setDefault('America/Montevideo');

start();
