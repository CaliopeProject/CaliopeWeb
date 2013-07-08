define(['angular', 'tools-filesuploader-ctrl'], function(angular) {
    'use strict';

    var url = 'upload/';

    angular.module('FilesUploadController', [])
        .config([
            '$httpProvider',
            function ($httpProvider) {
                /*
                if (isOnGitHub) {
                    // Demo settings:
                    delete $httpProvider.defaults.headers.common['X-Requested-With'];
                    angular.extend(fileUploadProvider.defaults, {
                        // Enable image resizing, except for Android and Opera,
                        // which actually support image resizing, but fail to
                        // send Blob objects via XHR requests:
                        disableImageResize: /Android(?!.*Chrome)|Opera/
                            .test(window.navigator && navigator.userAgent),
                        maxFileSize: 5000000,
                        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
                    });
                }
                */
            }
        ])

        .controller('DemoFileUploadController', [
            '$scope', '$http', '$filter', '$window',
            function ($scope, $http, $filter, $window) {
                /*
                if (!isOnGitHub) {
                    $scope.loadingFiles = true;
                    $scope.options = {
                        url: url
                    };
                    $scope.display = function ($event, file) {
                        var images = $filter('filter')($scope.queue, function (file) {
                            if (file.thumbnail_url) {
                                return true;
                            }
                        });
                        if ($window.blueimp.Gallery(images, {
                                index: file,
                                urlProperty: 'url',
                                titleProperty: 'name',
                                thumbnailProperty: 'thumbnail_url'
                            })) {
                            // Prevent the default link action on
                            // successful Gallery initialization:
                            $event.preventDefault();
                        }
                    };
                    $http.get(url)
                        .then(
                            function (response) {
                                $scope.loadingFiles = false;
                                $scope.queue = response.data.files || [];
                            },
                            function () {
                                $scope.loadingFiles = false;
                            }
                        );
                }
                */
            }
        ])

        .controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.delete_url,
                            method: file.delete_type
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);

});
