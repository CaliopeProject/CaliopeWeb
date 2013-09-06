/*jslint browser: true*/
/*global jQuery,
 CaliopeWebFormSpecificDecorator,
 CaliopeWebFormAttachmentsDecorator,
 CaliopeWebFormActionsDecorator,
 CaliopeWebFormValidDecorator,
 CaliopeWebFormLayoutDecorator,
 CaliopeWebForm,define
 */
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
        var promise = {};
        var webSockets = webSocket.WebSockets();

        var model = Service.caliopeForm.id;
        if (Service.caliopeForm.mode === 'create') {
          method = model.concat('.getModel');
          promise = webSockets.serversimm.sendRequest(method, params);
        }
        if (Service.caliopeForm.mode === 'edit') {

          var deferred = $q.defer();
          promise = deferred.promise;

          method = model.concat('.getModel');
          var promiseGetModel = webSockets.serversimm.sendRequest(method, params);

          promiseGetModel.then(function(resultModel) {
            method = model.concat('.getData');
            params.uuid = Service.caliopeForm.uuid;
            var promiseGetData = webSockets.serversimm.sendRequest(method, params);
            promiseGetData.then(function(resultData) {
              if( resultData !== undefined && resultModel !== undefined ) {
                resultModel.data = resultData;
              }

              deferred.resolve(resultModel);
            });

          });

        }

        return promise;
      };

      /**
      * Send the data register for the user in a form
      * @param formTemplate Name of the form template
      * @param actionMethod Action invoked
      * @param object Object that contains the data form.
      * @param modelUUID UUID of the form
      * @param objID Identified of the data
      * @returns {{}}
      */
      Service.sendDataForm = function(formTemplateName, actionMethod, object, modelUUID, objID ) {

        var params = {};
        var method = actionMethod;

        if( object === undefined ) {
          object = {};
        }
        if(objID !== undefined && objID.length > 0) {
          object.uuid = objID;
        }

        params = {
          //"formId" : formTemplateName
          //"modelUUID" : modelUUID
        };
        params.data = {};
        jQuery.extend(params.data, object);
        var promise = {};

        var webSockets = webSocket.WebSockets();
        promise = webSockets.serversimm.sendRequest(method, params);

        return promise;
      };

      Service.loadDataOptions = function(met, formId, paramsSearch) {
        var method = met;
        var params = {
          'formId' : formId
        };

        if( paramsSearch !== undefined ) {
          jQuery.extend(params, paramsSearch);
        }
        var webSockets = webSocket.WebSockets();
        var promise = webSockets.serversimm.sendRequest(method, params);
        return promise;
      };

      Service.load = function ( value , context) {

          var templateFromServer = value;
          var result = {};

          if (templateFromServer !== undefined && templateFromServer.error === undefined &&
          templateFromServer.form !== undefined) {

            var caliopeWebForm = new CaliopeWebForm();
            caliopeWebForm.addStructure(templateFromServer.form, templateFromServer.form.name);
            caliopeWebForm.addActions(templateFromServer.actions);
            caliopeWebForm.addData(templateFromServer.data);
            caliopeWebForm.addTranslations(templateFromServer.translations);
            caliopeWebForm.addlayout(templateFromServer.layout);

            CaliopeWebFormSpecificDecorator.createStructureToRender(caliopeWebForm);
            CaliopeWebFormLayoutDecorator.createStructureToRender(caliopeWebForm);
            CaliopeWebFormValidDecorator.createStructureToRender(caliopeWebForm);
            CaliopeWebFormActionsDecorator.createStructureToRender(caliopeWebForm);
            CaliopeWebFormAttachmentsDecorator.createStructureToRender(caliopeWebForm);

            result.structureToRender = caliopeWebForm.createStructureToRender();
            result.elements          = caliopeWebForm.getElements();
            result.modelUUID         = caliopeWebForm.getModelUUID();
            result.data              = caliopeWebForm.getData();
            result.elementsName      = caliopeWebForm.getElementsName();

            caliopeWebForm.putDataToContext(context, result.elements);
            return result;
          }
      };

    return Service;

  }]);

  /**
   * Define the module for service caliope web grid
   * @module caliopewebGridSrv
   */
  moduleServices.factory('caliopewebGridSrv',
    ['$q', '$rootScope', '$http', 'webSocket',
    function ($q, $rootScope, $http, webSocket) {

      var Service     = {};
      var webSockets = webSocket.WebSockets();

      function load(dataGrid) {
        var structureToRender = undefined;
        var error = false;

        if( dataGrid !== undefined && dataGrid !== null) {
          var caliopeWebGrid = new CaliopeWebGrid();
          caliopeWebGrid.addGridName();
          caliopeWebGrid.addData(dataGrid);
          CaliopeWebGridDataDecorator.createStructureToRender(caliopeWebGrid);
          structureToRender = caliopeWebGrid.createStructureToRender();
        }
        return structureToRender;
      };

      Service.createGrid = function(nameGrid, methodServer, params) {

        /**
         * Method of procesing response
         * @param promise
         * @returns {*}
         */



        var processResponse = function(promise) {
          var promiseHandResult = promise.then( function(response) {
            var data = undefined;

            if( response !== undefined && response !== null ) {
              if( response['error'] === undefined ) {
                data = response;
                caliopeWebGrid.addData(data);
              } else {
                var error = response['error'];
                throw new Error('Has produced a server error:' + error.message);
              }
            }

            return data;
          });

          return promiseHandResult;
        };

        var caliopeWebGrid = new CaliopeWebGrid(webSockets.serversimm, methodServer, params,
            processResponse);

        caliopeWebGrid.addGridName(nameGrid);

        return caliopeWebGrid;
      }

      Service.loadDataGrid = function(method, paramsSearch) {
        var method = method;
        var params = {};
        var promise = {};
        if( paramsSearch !== undefined ) {
          jQuery.extend(params, paramsSearch);
        }

        promise = webSockets.serversimm.sendRequest(method, params);

        var promiseHandResult = promise.then( function(response) {
          var gridToRender = undefined;
          var error = undefined;
          var result = {};

          if( response !== undefined && response !== null ) {
            if( response['error'] === undefined ) {
              gridToRender = load(response);
            } else {
              error = response['error'];
            }
          }

          result.error = error;
          result.gridToRender = gridToRender;
          return result;
        });
        return promiseHandResult;
      };

    return Service;

  }]);

});