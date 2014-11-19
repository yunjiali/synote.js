'use strict';

/**
 * @ngdoc function
 * @name synoteClient.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('LoginCtrl',  ['$scope', '$location', '$window', 'authenticationService', function ($scope, $location, $window, authenticationService) {
    $scope.userInfo = null;
    $scope.login = function () {
      authenticationService.login($scope.email, $scope.password)
        .then(function (result) {
          $scope.userInfo = result;
          $location.path('/');
        }, function (error) {
          $window.alert('Invalid credentials');
          console.log(error);
        });
    };

    $scope.cancel = function () {
      $scope.userName = '';
      $scope.password = '';
    };
  }]);
