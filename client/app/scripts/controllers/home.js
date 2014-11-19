'use strict';

/**
 * @ngdoc function
 * @name synoteClient.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('HomeCtrl', ['$scope', '$location', 'authenticationService', 'auth',function ($scope, $location, authenticationService, auth) {
    $scope.userInfo = auth;

    $scope.logout = function () {

      authenticationService.logout()
        .then(function (result) {
          $scope.userInfo = null;
          $location.path('/login');
        }, function (error) {
          console.log(error);
        });
    };
  }]);
