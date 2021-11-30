import Application from 'timo-frontend/app';
import config from 'timo-frontend/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import moment from 'moment';

setApplication(Application.create(config.APP));

moment.tz.setDefault('America/Montevideo');
setup(QUnit.assert);

start();
