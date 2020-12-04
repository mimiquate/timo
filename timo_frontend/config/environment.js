'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'timo-frontend',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    moment: {
      includeTimezone: 'all'
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-75322585-3',
          // Use `analytics_debug.js` in development
          debug: environment === 'development',
          // Use verbose tracing of GA events
          trace: environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development',
        }
      }
    ]
  };

  ENV['@sentry/ember'] = {
    disablePerformance: true,
    sentry: {
      dsn: "https://558b36cdbffb4ce59b1c6ff609f37ce4@o482985.ingest.sentry.io/5534040",

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
      enabled: environment === 'production'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {
      enabled: false
    };
    ENV.serverHost = 'http://localhost:4000';

    ENV.demoShareId = 'ffciBKOl_jtU';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    ENV.serverHost = '';

    ENV.demoShareId = 'yjHktCOyBDTb'
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.serverHost = 'https://timo-backend.mimiquate.xyz';

    ENV.demoShareId = 'wUtkGcozsZ2p'
  }

  return ENV;
};
