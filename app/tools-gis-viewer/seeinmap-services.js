/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'angular-ui-bootstrap-bower'], function(angular) {
    'use strict';

    var moduleServices = angular.module('seeinmap-services', ['ui.bootstrap.dialog']);

    moduleServices.factory('seeinmapService',
        ['SessionSrv', '$log','$http', '$q', '$location', '$dialog', '$rootScope', 'webSocket', 'caliopewebTemplateSrv'
            , function( security,    $log,  $http,   $q,   $location,   $dialog,   $rootScope,   webSocket, tempServices) {

           // The public API of the service
            var service =  {
                findByPredio: function() {
                    console.log("funciona desde servicio");
                }
            };

            return service;

        }]);
});

