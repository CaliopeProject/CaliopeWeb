'use strict';

/**
* The application angular app initializing the main module and 
* creating namespaces and moduled for controllers, filters, services, and directives. 
*/

var Application = Application || {};

Application.Constants   = angular.module('application.constants'   , []);
Application.Services    = angular.module('application.services'    , []);
Application.Controllers = angular.module('application.controllers' , []);
Application.Filters     = angular.module('application.filters'     , []);
Application.Directives  = angular.module('application.directives'  , []);

angular.module('application', []).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {templateUrl: 'login/login-partial.html'}).
  otherwise({templateUrl: 'error/error-partial.html'});
}]);
