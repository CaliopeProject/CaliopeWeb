/*global require*/
'use strict';

require.config({
  "baseUrl": "../app/",

  "paths"  : {
    "jquery"          : "libs-js-thirdparty/jquery",
    "angular"         : "libs-js-thirdparty/angular-unstable/angular",
    "ui-bootstrap"    : "libs-js-thirdparty/angular-ui-bootstrap-bower/ui-bootstrap",
    "application-app" : "application/application-app"
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

require(['angular','application-app','ui-bootstrap'], function(angular, app){
  app.init;
});
