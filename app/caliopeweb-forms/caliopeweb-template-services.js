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
            method = 'form.getTemplate';
            params.domain = "";
            params.version = "3";
          }
          if (caliopeForm.mode === 'edit') {
            method = 'form.getData';
            params.uuid = caliopeForm.uuid;
          }

          var promise = {};

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);

          return promise;
        };

        /**
         * Send the data register for the user in a form
         * @param formTemplate Name of the form template
         * @param actionMethod Action invoked
         * @param object Object that contains the data form.
         * @param formUUID UUID of the form
         * @param objID Identified of the data
         * @returns {{}}
         */
        Service.sendDataForm = function(formTemplateName, actionMethod, object, formUUID, objID ) {
          var NAME_SPACED_METHOD = 'form';
          var params = {};
          var method = NAME_SPACED_METHOD.concat('.').concat(actionMethod);
                  
          if( object === undefined ) {
            object = {};
          }
          if(objID !== undefined) {
            object['uuid'] = objID;
          }

          params = {
            "formId" : formTemplateName,
            "formUUID" : formUUID
          };
          params.data = {};
          jQuery.extend(params.data, object);
          var promise = {};

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);

          return promise;
        };

        Service.loadDataGrid = function(formId, paramsSearch) {
          var method = "form.getDataList";
          var params = {
            formId : formId
          };
          var promise = {};
          if( paramsSearch !== undefined ) {
            jQuery.extend(params, paramsSearch);
          }

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);
          return promise;
        };

        Service.loadDataOptions = function(entity, paramsSearch) {
          var method = "getDataOptions";
          var params = {
            entity : entity
          };
          var promise = {};
          if( paramsSearch !== undefined ) {
            jQuery.extend(params, paramsSearch);
          }

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);
          return promise;
        };

        return Service;

      }]);

});
