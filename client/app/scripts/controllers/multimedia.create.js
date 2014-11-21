'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:MultimediaCreateCtrl
 * @description
 * # MultimediaCreateCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('MultimediaCreateCtrl', ["$scope","multimediaService", function ($scope,multimediaService) {
    $scope.metadata;
    $scope.url;
    $scope.alerts = [];
    $scope.getMetadata = function(){
      //http to get metadata
      multimediaService.getMetadata($scope.url,true)
        .then(function (result) {
          $scope.metadata = result;
          $('.tagsinput').tagsinput();
        }, function (error) {
          //console.log(error);
          $scope.alerts.push({type:'danger', msg:error.message});
        });
    }
  }]);
