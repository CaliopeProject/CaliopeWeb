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

        Service.completeTemplateForAngular = (function () {

          var formsWithOwnController = ['login'];
          var ctrlSIMMName           = 'SIMMFormCtrl';
          var ctrlEndName            = 'Ctrl';
          var inputsNames            = [];



          function completeModelRecursive(jsonTemplate) {
            if (jsonTemplate.html !== undefined && 
                jsonTemplate.html.length > 0) {
              completeModelRecursive(jsonTemplate.html);
            } else {
              var elements = jQuery.grep(jsonTemplate, function(obj) {
                return obj.type != null;
              });
              for ( var i = 0; i < elements.length; i++) {
                completeModelIndividual(elements[i]);
              }
            }
          }

          function completeModelIndividual(element) {
            var stElement = JSON.stringify(element);
            var name = element.name;

            if( name == null ) {
              name = element.id;
            }

            var valueNgModel = "";
            if( name != null ) {
              valueNgModel = name;
            } else {
              //TODO: Definir que se hace cuando no viene el att name,
              // se debería generar una excepcion indicando el error y notificando
                // al server sobre el error.
              //valueNgModel = stNameTemplate;
              console.error('No se encontro valor para el atributo name en el template.');
            }
            element['ng-model'] = valueNgModel;
            inputsNames.push(valueNgModel);
          }

          function completeController(jsonTemplateForm) {
            var valueNgCtrl = ctrlSIMMName;

            if( formsWithOwnController.indexOf(jsonTemplateForm.name) >= 0 ) {
              valueNgCtrl = jsonTemplateForm.name;
              valueNgCtrl = valueNgCtrl.slice(0, 1).toUpperCase().concat(
                valueNgCtrl.slice(1, valueNgCtrl.length)
              );
              valueNgCtrl = valueNgCtrl.concat(ctrlEndName);
            }
            if( valueNgCtrl != null) {
              valueNgCtrl = valueNgCtrl;
              jsonTemplateForm['ng-controller'] = valueNgCtrl;
            }
          }

          function completeActions(jsonTemplateForm, jsonTemplateActions,
          jsonTemplateTranslations) {

            var nameForm = jsonTemplateForm.name;

            if( jsonTemplateActions != null && jsonTemplateActions.length > 0 ) {
              for ( var i = 0; i < jsonTemplateActions.length; i++) {
                var action = {};
                action.type = "button";
                action['ng-click'] = jsonTemplateActions[i] + "(" + nameForm +")";
                var actionSrv = jsonTemplateActions[i];
                if (jsonTemplateTranslations !== undefined && 
                    jsonTemplateTranslations[actionSrv] !== undefined) {
                  action.html = jsonTemplateTranslations[actionSrv];
                } else {
                  action.html = actionSrv;
                }
                jsonTemplateForm.html.push(action);
              }
            }
          }

          return {
            jsonTemplateGen: function (jsonTemplateGen) {
              var jsonTemplateGenTmp = jsonTemplateGen;
              inputsNames = [];
              /*
              * If jsonTemplate not is null then runs the functionality that attach the
              * directives of angularJS to jsonTemplate.
              */

              if( jsonTemplateGenTmp != null && jsonTemplateGenTmp.form != null) {
                var jsonTemplateForm = jsonTemplateGenTmp.form;
                var jsonTemplateData = jsonTemplateGen.data;
                var jsonTemplateActions = jsonTemplateGenTmp.actions;
                var jsonTemplateTranslations = jsonTemplateGenTmp.translations;

                completeController(jsonTemplateForm);
                completeModelRecursive(jsonTemplateForm);
                completeActions( jsonTemplateForm, jsonTemplateActions,
                  jsonTemplateTranslations
                );
              } else {
                console.error('No existe form para agregar');
              }

              return jsonTemplateGenTmp;
            },
            inputs : function() {
              return inputsNames;
            }
          };

        })();

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
          var method = "loadDataGrid";
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
