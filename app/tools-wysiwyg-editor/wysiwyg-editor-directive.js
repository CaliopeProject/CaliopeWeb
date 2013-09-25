/*jslint browser: true*/
/*global define, console, $*/

define(['angular','ckeditor'], function (angular) {
  'use strict';  
  
var dirmodule = angular.module('wysiwygEditorDirective', []);

dirmodule.directive('ckedit', function ($parse) {
    CKEDITOR.disableAutoInline = true;
    var counter = 0,
    prefix = '__ckd_';

    return {
        templateUrl: 'tools-wysiwyg-editor/wysiwyg-editor-directive.html',
        replace: true,
        restrict: 'E',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {

          var initData;
          if(scope.$parent !== undefined) {
            var name = attrs.name;
            if(name !== undefined && scope.$parent.hasOwnProperty(name)) {
              initData = scope.$parent[name];
              element.append(initData);
            }
          }

          // Write data to the model
          function read() {
            var html = element.html();
            // When we clear the content editable the browser leaves a <br> behind
            // If strip-br attribute is provided then we strip this out
            if( attrs.stripBr && html == '<br>' ) {
              html = '';
            }
            ngModel.$setViewValue(html);
          }

          if( ngModel !== undefined ) {
            // Specify how UI should be updated
            ngModel.$render = function() {
              element.html(ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
              scope.$apply(read);
            });

            read(); // initialize
          }

          var getter = $parse(attrs.ckedit),
              setter = getter.assign;


          if( ngModel !== undefined ) {
            // Specify how UI should be updated
            ngModel.$render = function() {
              element.html(ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
              scope.$apply(read);
            });
            read(); // initialize
          }

          if (!attrs.id) {
              attrs.$set('id', prefix + (++counter));
          }

          // CKEditor stuff
          // Override the normal CKEditor save plugin

          CKEDITOR.plugins.registered['save'] =
          {
              init: function (editor) {
                  editor.addCommand('save',
                      {
                          modes: { wysiwyg: 1, source: 1 },
                          exec: function (editor) {
                              if (editor.checkDirty()) {
                                  var ckValue = editor.getData();
                                  scope.$apply(function () {
                                      setter(scope, ckValue);
                                  });
                                  ckValue = null;
                                  editor.resetDirty();
                              }
                          }
                      }
                  );
                  editor.ui.addButton('Save', { label: 'Save', command: 'save', toolbar: 'document' });
              }
          };
          var options = {
              toolbar : [
                          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
                          { name: 'insert', items: [ 'Image','Link' ] },
                          { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] }
                        ],
              toolbarGroups: [
                          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                          { name: 'insert' },
                          { name: 'clipboard', groups: [ 'clipboard', 'undo' ] }
                      ]
              };

          options.removePlugins = 'sourcearea';
          CKEDITOR.inline(element[0], options);

        }
    }
    
});

});
