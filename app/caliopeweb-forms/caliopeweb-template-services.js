/*jslint browser: true*/
/*global jQuery,
 CaliopeWebFormSpecificDecorator,
 CaliopeWebFormAttachmentsDecorator,
 CaliopeWebFormActionsDecorator,
 CaliopeWebFormValidDecorator,
 CaliopeWebFormLayoutDecorator,
 CaliopeWebForm,define
 */
define(['angular', 'caliopeWebForms', 'caliopeWebGrids'], function(angular) {
  'use strict';

  var moduleServices = angular.module('CaliopeWebTemplatesServices', []);

  moduleServices.constant('MethodsResquestConst', {
    'getFormTemplate'  : 'getFormTemplate'
  });

  moduleServices.factory('caliopewebTemplateSrv',
    ['$q', 'webSocket',
    function ($q, webSocket) {

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
          var webSockets = webSocket.WebSockets();
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
            params.data = 'false';
            promiseMode = webSockets.serversimm.sendRequest(method, params);
            promiseMode.then(resolveResult);

          } else if (mode === 'toEdit' || mode==='edit') {
            var modelUUID = cwForm.getModelUUID();
            //promise = deferred.promise;

            method = model.concat('.getModel');
            params.data = 'false';
            var promiseGetModel = webSockets.serversimm.sendRequest(method, params);

            promiseGetModel.then(function(resultModel) {
              method = model.concat('.getData');
              params.uuid = modelUUID;
              delete params.data;
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
      }

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
      Service.sendDataForm = function(formTemplateName, actionMethod, object,  objID, encapsulateInData) {

        var params = {};
        var method = actionMethod;

        if( object === undefined ) {
          object = {};
        }
        if(objID !== undefined && objID.length > 0) {
          object.uuid = objID;
        }


        if( encapsulateInData === true || encapsulateInData === "true" ) {
          params.data = {};
          jQuery.extend(params.data, object);
          params = {
            "formId" : formTemplateName
          };
        } else {
          jQuery.extend(params, object);
        }
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

          } else if(templateFromServer.error !== undefined) {
            result.error = templateFromServer.error;
          } else if(templateFromServer === undefined || templateFromServer.form === undefined ) {
            result.error = 'Form load from server is empty';
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
        var cwForm = new CaliopeWebForm(model.name);
        cwForm.addStructure(model, model.name);
        return cwForm.dataToServerData(data);
      };


    return Service;

  }]);


  /**
   * Define the module for service caliope  Notification 
   * @module caliopeWebFormNotification
   */
  moduleServices.factory('caliopeWebFormNotification',
    ['webSocket',
      function (webSocket) {
          var webSockets  = webSocket.WebSockets();
          var promiseMode = {};
          var METHOD_NOTIF = {
            UPDATE_FIELD : 'updateField',
            UPDATE_RELATION : 'updateRelationship',
            DELETE_RELATION : 'deleteRelationship',
            COMMIT : 'commit'
          }

          /*
          TODO: Este código también se encuentra en CaliopeWebForms, es necesario crear una nueva librería
           de integración de CaliopeWebForm con Caliope Backend donde se ponga toda la lógica necesaria
           para trabajar como está ahora el backend como las relaciones
           */
          function getVarNameScopeFromFormRep(formRep) {
            return formRep.replace(new RegExp(CaliopeWebFormConstants.rexp_value_in_form_inrep),"").
                replace(new RegExp(CaliopeWebFormConstants.rexp_value_in_form_firep),"")
          }

          function isRepresentationFormRep(val) {
            var patt = new RegExp(CaliopeWebFormConstants.rexp_value_in_form);
            return patt.test(val);
          }

          function getMethod(cwForm, initMethod) {
            var method;
            /*
             * If form is generic form then the method to invoke the server is form.method, otherwise is
             * entity.method.
             */
            if( cwForm.getGenericForm() === true ) {
              method = 'form.'.concat(initMethod);
            } else {
              method = cwForm.getEntityModel().concat('.').concat(initMethod);
            }

            return method;

          }

          function updateField(cwForm, data, elementModified) {

            var uuidForm = cwForm.getModelUUID();
            var modifications = [];
            var params = {
              "uuid"  : uuidForm,
              "field_name" : elementModified.name,
              "value" : data[elementModified.name]
            };
            var method =  getMethod(cwForm, METHOD_NOTIF.UPDATE_FIELD);
            if( params.value === undefined ) {
              params.value = '';
            }

            modifications[0] = {
              method : method,
              params : params
            }

            return modifications;

          };

          function updateRelationShip(cwForm, data, elementModified)  {

            var modifications = [];

            if(elementModified.hasOwnProperty('relation')) {
              var uuidForm = cwForm.getModelUUID();

              var params = {
                "uuid"  : uuidForm,
                "rel_name" : '',
                "target_uuid" : '',
                "new_properties" : {}
              };
              var method =  getMethod(cwForm, METHOD_NOTIF.UPDATE_RELATION);

              //TODO: Posiblemente este código se puede poner en CaliopeWebForm o en la nueva libreria para integracion con backend

              var relation =  elementModified.relation;


              /*
              Asociar los valores para target
               */
              var valTarget = [];
              if(isRepresentationFormRep(relation.target)) {
                var nameVarData = getVarNameScopeFromFormRep(relation.target);
                valTarget =  data[nameVarData];
              } else {
                valTarget.push(relation.target);
              }

              if( !angular.isArray(valTarget) ) {
                var uniqueObj = {
                  uuid : valTarget.uuid
                }
                valTarget = [];
                valTarget.push(uniqueObj);
              }

              /*
               Asociar valor para properties
               */
              var valProperties = {};
              if( relation.hasOwnProperty('properties') ) {
                jQuery.each(relation.properties, function(keyProp, valProp){
                  if( isRepresentationFormRep(valProp) ) {
                    var nameVarData = getVarNameScopeFromFormRep(valProp);
                    valProp = data[nameVarData];
                  }
                  valProperties[keyProp] = valProp;
                });
              }

              /*
              Crear las modificaciones que se deben enviar al srv.
               */
              if( valTarget !== undefined)
              jQuery.each(valTarget, function(keyTarget, valTarget) {
                var cParams = {};
                jQuery.extend(cParams, params);
                /*
                 Asociar el nombre de la relacion
                 */
                cParams.rel_name = relation.rel_name;
                cParams.target_uuid = valTarget.uuid;
                jQuery.extend(cParams.new_properties, valProperties);

                var modification = {
                  'method' : method,
                  'params' : cParams
                }
                modifications.push(modification)
              });


            }

            return modifications;
          }

        function deleteRelationShip(cwForm, data, elementModified)  {

          var modifications = [];

          if(elementModified.hasOwnProperty('relation')) {
            var uuidForm = cwForm.getModelUUID();

            var params = {
              "uuid"  : uuidForm,
              "rel_name" : '',
              "target_uuid" : ''
            };
            var method =  getMethod(cwForm, METHOD_NOTIF.DELETE_RELATION);

            //TODO: Posiblemente este código se puede poner en CaliopeWebForm o en la nueva libreria para integracion con backend

            var relation =  elementModified.relation;

            /*
             Asociar los valores para target
             */
            var valTarget = [];
            if(isRepresentationFormRep(relation.target)) {
              var nameVarData = getVarNameScopeFromFormRep(relation.target);
              valTarget =  data[nameVarData];
            } else {
              valTarget.push(relation.target);
            }

            /*
             Crear las modificaciones que se deben enviar al srv.
             */
            jQuery.each(valTarget, function(keyTarget, valTarget) {
              var cParams = {};
              jQuery.extend(cParams, params);
              /*
               Asociar el nombre de la relacion
               */
              cParams.rel_name = relation.rel_name;
              cParams.target_uuid = valTarget.uuid;

              var modification = {
                'method' : method,
                'params' : cParams
              }
              modifications.push(modification)
            });


          }

          return modifications;
        }

          return {
            sendChange: function(cwForm, data, fieldModified){

              var element = cwForm.getElement(fieldModified);
              if( element !== undefined ) {
                var modifications = undefined;
                if( element.hasOwnProperty('relation') ) {
                  modifications = updateRelationShip(cwForm, data, element);
                } else {
                  modifications = updateField(cwForm, data, element)
                }

                //TODO: Change to send batch
                jQuery.each(modifications, function(kMod, vMod) {
                  promiseMode = webSockets.serversimm.sendRequest(vMod.method, vMod.params);
                });
              }
            },

            sendCommit : function(cwForm) {
              var params = {
                uuid : cwForm.getModelUUID()
              }
              var method = getMethod(cwForm, METHOD_NOTIF.COMMIT);
              return webSockets.serversimm.sendRequest(method, params);
            },

            sendDelete : function(cwForm, data, fieldModified) {
              var element = cwForm.getElement(fieldModified);
              if( element !== undefined ) {
                var modifications = undefined;
                if( element.hasOwnProperty('relation') ) {
                  modifications = deleteRelationShip(cwForm, data, element);
                } else {
                  //modifications = deleteField(cwForm, data, element)
                }

                //TODO: Change to send batch
                jQuery.each(modifications, function(kMod, vMod) {
                  promiseMode = webSockets.serversimm.sendRequest(vMod.method, vMod.params);
                });
              }
            }
          }
      }
    ])

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
        var structureToRender;
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
