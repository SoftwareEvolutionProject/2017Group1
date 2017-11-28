// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const isDocker = require('is-docker')();

module.exports = function (config) {

  config.set({

    customLaunchers: {
      Chrome_without_sandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox','--disable-web-security'] // with sandbox it fails under Docker
      }
    },

    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul']
      : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ALL,
    autoWatch: true,
    browsers:[ isDocker ? 'Chrome_without_sandbox' : 'Chrome'],
    singleRun: isDocker,
    browserNoActivityTimeout: 10000000,
    captureTimeout: 100000
  });
};
