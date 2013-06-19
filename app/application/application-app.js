/*global require*/
'use strict';
define( ["angular"],(function (angular) {
    /**
    * The application angular app initializing the main module and
    * creating namespaces and moduled for controllers, filters, services, and directives.
    */
    return {
      Constants   : angular.module('application.constants'   , []),

      Services    : angular.module('application.services'    , []),

      Controllers : angular.module('application.controllers' , []),

      Filters     : angular.module('application.filters'     , []),

      Directives  : angular.module('application.directives'  , []),

      init        :  function () {
        angular.module('application', []).
        config(['$routeProvider', function($routeProvider) {
          $routeProvider.
          when('/', {templateUrl: 'login/login-partial.html'}).
          otherwise({templateUrl: 'error/error-partial.html'});
        }]);
      }
  };
}()));
