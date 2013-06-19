/*global require*/
'use strict';

require.config({
  "baseUrl": "./src/",

  "paths": {
    "angular"      : "libs-js-thirdparty/angular-unstable/angular.js",
    "jquery"       : "libs-js-thirdparty/jquery",
    "ui-bootstrap" : "libs-js-thirdparty/angular-ui-bootstrap-bower/ui-bootstrap"
  }

});

require(["app"],
        function(App){
          App.initialize();
        }
       );
