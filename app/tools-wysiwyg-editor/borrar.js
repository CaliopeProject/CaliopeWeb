directive('ckEditor', function() {

    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
           
            var ck = CKEDITOR.replace(elm[0],
                {
                    toolbarGroups: [
                      { name: 'clipboard', groups: ['clipboard', 'undo'] },   
                      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }
                    ]
                }
            );
            if (!ngModel) return;

            ck.on('pasteState', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            ngModel.$render = function (value) {
                ck.setData(ngModel.$viewValue);
            };
        }
    };
});

});
