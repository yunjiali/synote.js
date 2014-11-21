'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('HeaderCtrl', ['$scope', '$location', 'authenticationService', function ($scope, $location, authenticationService) {
    //$scope.isLoggedIn =
    //console.log("haha");

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.isLoggedIn = function(){
      return authenticationService.isLoggedIn();
    }

    $scope.getUserInfo = function(){
      return authenticationService.getUserInfo();
    }
}]);
