/*global require*/
'use strict';

require.config({
  "baseUrl": "../app/",

  "paths"  : {
    //libs-thirdparty
    "jquery"          : "libs-js-thirdparty/jquery/jquery",
    "angular"         : "libs-js-thirdparty/angular-unstable/angular",
    "ui-bootstrap"    : "libs-js-thirdparty/angular-ui-bootstrap-bower/ui-bootstrap",

    //local modules scripts
    "application-app"   : "application/application-app",
    "application-route" : "application/application-route"
  },

  shim     : {
    "ui-bootstrap":["angular"],
    'angular': {
      exports: 'angular'
    },
    'application-app': {
      exports: 'app'
    }
  }
});

require([ 'angular',
          'application-app',
          'application-route'], function (angular) {
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['caliope']);
  });
});
