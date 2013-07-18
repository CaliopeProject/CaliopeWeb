define(['angular'], function(angular) {
  'use strict';

  var moduleServices = angular.module('CaliopeWebTemplatesServices', []);

  moduleServices.constant('MethodsResquestConst', {
    'getFormTemplate'  : 'getFormTemplate'
  });

  moduleServices.factory('caliopewebTemplateSrv',
    ['$q', '$rootScope', '$http', 'webSocket',
      function ($q, $rootScope, $http, webSocket) {

        //We return this object to anything injecting our service
        var Service = {};

        /**
         * Load the json template that define the form with fields.
         * @param caliopeForm Form to retrieve.
         * @returns {{}} Promise created to the send the request to the server.
         */
        Service.loadTemplateData = function (caliopeForm) {
          var method = {};
          var params = {};
          params.formId = caliopeForm.id;

          if (caliopeForm.mode === 'create') {
            method = 'getFormTemplate';
            params.domain = "";
            params.version = "3";
          }
          if (caliopeForm.mode === 'edit') {
            method = 'getFormData';
            params.uuid = caliopeForm.uuid;
          }
         
          var promise = {};

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);

          return promise;
        };

        /**
         * Send the data register for the user in a form
         * @param object Object that contains the data form.
         * @param caliopeForm Form Template que
         * @returns {{}}
         */
        Service.sendDataForm = function(object, caliopeForm) {
          var params = {};
          var formId = caliopeForm.id;
          var method = caliopeForm.mode;
                  
          params = {
            "formId" : formId
          };
          params.data = {};
          jQuery.extend(params.data, object);
          var promise = {};

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);

          return promise;
        };

        Service.loadDataGrid = function(formId, paramsSearch) {
          var method = "getFormDataList";
          var params = {
            formId : formId
          };
          var promise = {};
          if( params !== undefined ) {
            jQuery.extend(params, paramsSearch);
          }

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);
          return promise;
        };

        return Service;

      }]);

});
