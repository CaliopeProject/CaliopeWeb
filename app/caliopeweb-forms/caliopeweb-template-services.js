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
      /**
       *
       * @type {{}}
       */
      Service.caliopeForm = {};

      /**
       *
       * @param model
       * @param mode
       * @param modelUUID
       * @param params
       * @returns {{}}
       */
      function getForm(cwForm, params) {

        var promise = {};
        if( cwForm !== undefined ) {
          var method = {};
          var promiseMode = {};
          var webSockets = webSocket.WebSockets()
          var mode = cwForm.getMode();
          var model = cwForm.getEntityModel();

          if(params === undefined ) {
            params = {};
          }
          var deferred = $q.defer();
          promise = deferred.promise;

          var resolveResult = function(dataForm) {
            if( dataForm !== undefined ) {
              var result = Service.load(dataForm, cwForm) ;
              deferred.resolve(result);
            }
          };

          if (mode === 'toCreate' || mode==='create' ) {
            method = model.concat('.getModel');
            promiseMode = webSockets.serversimm.sendRequest(method, params);
            promiseMode.then(resolveResult)

          } else if (mode === 'toEdit' || mode==='edit') {
            var modelUUID = cwForm.getModelUUID();
            //promise = deferred.promise;

            method = model.concat('.getModel');
            var promiseGetModel = webSockets.serversimm.sendRequest(method, params);

            promiseGetModel.then(function(resultModel) {
              method = model.concat('.getData');
              params.uuid = modelUUID;
              var promiseGetData = webSockets.serversimm.sendRequest(method, params);
              promiseGetData.then(function(resultData) {
                if( resultData !== undefined && resultData.error === undefined &&
                    resultModel !== undefined ) {
                  resultModel.data = resultData;
                } else if(resultData.error !== undefined){
                  resultModel = resultData;
                }
                resolveResult(resultModel);
              });
              promiseMode = promiseGetData;

            });
          } else {
            throw new Error('Mode not is supported to load the form from server.');
          }
        } else {
          throw new Error('Caliope Web Form is undefined.');
        }

        return promise;
      };

      /**
      * Load the json template that define the form with fields.
      * @param caliopeForm Form to retrieve.
      * @returns {{}} Promise created to the send the request to the server.
      */
      Service.loadTemplateData = function (params) {

        var cwForm = new CaliopeWebForm(
            Service.caliopeForm.id, Service.caliopeForm.mode, Service.caliopeForm.uuid);

        return getForm(cwForm, params);
      };

      /**
       *
       * @param cwForm
       * @param params
       * @returns {*}
       */
      Service.loadForm = function(cwForm, params) {
        return getForm(cwForm, params);
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


      /**
       *
       * @param met
       * @param params
       * @returns {Function|promise}
       */
      Service.loadData = function(met, params) {
        var method = met;

        var webSockets = webSocket.WebSockets();
        var promise    = webSockets.serversimm.sendRequest(method, params);
        return promise;
      };

      /**
       *
       * @param met
       * @param formId
       * @param paramsSearch
       * @returns {Function|promise}
       */
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

      /**
       *
       * @param value
       * @param context
       * @param actionsToShow
       * @returns {{}}
       */
      Service.load = function (value , cwForm) {

          var context = {};
          var templateFromServer = value;
          var result = {};

          if (templateFromServer !== undefined && templateFromServer.error === undefined &&
            templateFromServer.form !== undefined) {

            cwForm.addStructure(templateFromServer.form, templateFromServer.form.name);
            cwForm.addActions(templateFromServer.actions);
            cwForm.setActionsMethodToShow(cwForm.getActionsToShow());
            cwForm.addData(templateFromServer.data);
            cwForm.addTranslations(templateFromServer.translations);
            cwForm.addlayout(templateFromServer.layout);

            CaliopeWebFormSpecificDecorator.createStructureToRender(cwForm);
            CaliopeWebFormLayoutDecorator.createStructureToRender(cwForm);
            CaliopeWebFormValidDecorator.createStructureToRender(cwForm);
            CaliopeWebFormActionsDecorator.createStructureToRender(cwForm);
            CaliopeWebFormAttachmentsDecorator.createStructureToRender(cwForm);

            result.structureToRender = cwForm.createStructureToRender();
            result.elements          = cwForm.getElements();
            result.modelUUID         = cwForm.getModelUUID();
            result.data              = cwForm.getData();
            result.elementsName      = cwForm.getElementsName();
            result.entityModel       = cwForm.getEntityModel();

            //cwForm.putDataToContext(context, result.elements);
          } else if(templateFromServer.error !== undefined) {
            result.error = templateFromServer.error
          } else if(templateFromServer === undefined || templateFromServer.form === undefined ) {
            result.error = 'Form load from server is empty'
          }
          return result;
      };

      /**
       *
       * @param entityModel
       * @param mode
       * @param uuid
       */
      Service.createForm = function(entityModel, mode, uuid) {
        var calWebForm = new CaliopeWebForm();
        calWebForm.setEntityModel(entityModel);
        calWebForm.setMode(mode);
        calWebForm.setModelUUID(uuid);
        return calWebForm;
      };

      /**
       *
       * @param model
       * @param data
       * @returns {*}
       */
      Service.getDataToServer = function(model, data) {
        var cwForm = new CaliopeWebForm();
        cwForm.addStructure(model, 'model');
        return cwForm.dataToServerData(data);
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

      Service.createGrid = function(gridName, methodServer, params) {

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

        caliopeWebGrid.addGridName(gridName);

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
