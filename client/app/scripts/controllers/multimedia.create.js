'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:MultimediaCreateCtrl
 * @description
 * # MultimediaCreateCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('MultimediaCreateCtrl', ["$scope","multimediaService", "utilService", function ($scope,multimediaService,utilService) {
    $scope.metadata;
    $scope.url;
    $scope.durationStr = "";
    $scope.tagsStr = "";
    $scope.getMetadata = function(){
      //http to get metadata
      multimediaService.getMetadata($scope.url,true)
        .then(function (result) {
          $scope.metadata = result;
          $scope.durationStr = utilService.secondsToHHMMSS($scope.metadata.metadata.duration);
          //console.log(result);
          $('.tagsinput').tagsinput();
        }, function (error) {
          //console.log(error);
          $scope.alerts.push({type:'danger', msg:error.message});
        });
    }

    $scope.create = function(){
      //deal with duration
      //deal with tags

    }
  }]);
