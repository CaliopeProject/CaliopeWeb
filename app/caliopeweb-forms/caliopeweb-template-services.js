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
        var Service     = {};
        Service.caliopeForm = {};
        /**
        * Load the json template that define the form with fields.
        * @param caliopeForm Form to retrieve.
        * @returns {{}} Promise created to the send the request to the server.
        */
        Service.loadTemplateData = function () {
          var method = {};
          var params = {};
          params.formId = Service.caliopeForm.id;

          if (Service.caliopeForm.mode === 'create') {
            method = 'form.getTemplate';
            params.domain = "";
            params.version = "3";
          }
          if (Service.caliopeForm.mode === 'edit') {
            method = 'form.getData';
            params.uuid = Service.caliopeForm.uuid;
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

          var params = {};
          var method = actionMethod;

          if( object === undefined ) {
            object = {};
          }
          if(objID !== undefined && objID.length > 0) {
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

        Service.load = function ( value , data) {

            var content = value;
            var result = {};

            if (content !== undefined && content.error === undefined &&
            content.form !== undefined) {

              var caliopeWebForm = new CaliopeWebForm();
              caliopeWebForm.addStructure(content.form, content.form.name);
              caliopeWebForm.addActions(content.actions);
              caliopeWebForm.addData(content.data);
              caliopeWebForm.addTranslations(content.translations);

              CaliopeWebFormSpecificDecorator.createStructureToRender(caliopeWebForm);
              CaliopeWebFormActionsDecorator.createStructureToRender(caliopeWebForm);
              CaliopeWebFormValidDecorator.createStructureToRender(caliopeWebForm);
              CaliopeWebFormAttachmentsDecorator.createStructureToRender(caliopeWebForm);

              result.structureToRender = caliopeWebForm.createStructureToRender();
              result.elementsName      = caliopeWebForm.getElementsName();
              result.formUuid          = caliopeWebForm.getFormUUID();

              caliopeWebForm.putDataToContext(data);
              return result;
            }
        };

        return Service;

        }]);
      });
