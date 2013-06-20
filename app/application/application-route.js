/*global define*/
'use strict';

define( ["angular"],(function (angular) {
    /**
    * The caliope angular app initializing the main module and
    * creating namespaces and moduled for controllers, filters, services, and directives.
    */
    return {

      Constants   : angular.module('caliope.constants'   , []),

      Services    : angular.module('caliope.services'    , []),

      Controllers : angular.module('caliope.controllers' , []),

      Filters     : angular.module('caliope.filters'     , []),

      Directives  : angular.module('caliope.directives'  , []),
      
      init        :  function () {
        angular.module('caliope', []).
        config(['$routeProvider', function($routeProvider) {
          $routeProvider.
          when('/', {templateUrl: 'login/login-partial.html'}).
          otherwise({templateUrl: 'error/error-partial.html'});
        }]);
      }
  };
}(angular)));
