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
        
        link: function (scope, element, attrs, controller) {
            var getter = $parse(attrs.ckedit), 
                setter = getter.assign;
      
            console.log(element)
            attrs.$set('contenteditable', true); // inline ckeditor needs this
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
            options.on = {
                blur: function (e) {
                    if (e.editor.checkDirty()) {
                        var ckValue = e.editor.getData();
                        scope.$apply(function () {
                            setter(scope, ckValue);
                        });
                        ckValue = null;
                        e.editor.resetDirty();
                    }
                }
            };
            options.removePlugins = 'sourcearea';
            var editorangular = CKEDITOR.inline(element[0], options); //invoke

            scope.$watch(attrs.ckedit, function (value) {
                editorangular.setData(value);
                console.log(value)
            });
        }
    }
    
});

});
