'use strict';

/**
 * @ngdoc function
 * @name synoteClient.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('LoginCtrl',  ['$scope', '$location', '$window', '$filter', 'authenticationService', function ($scope, $location, $window, $filter, authenticationService) {
    $scope.userInfo = null;
    $scope.alerts = [];
    var $translate = $filter('translate');

    $scope.login = function () {
      $scope.alerts = [];
      authenticationService.login($scope.email, $scope.password)
        .then(function (result) {
          $scope.userInfo = result;
          $location.path('/');
        }, function (error) {
          $scope.alert.push({type:'danger',msg:$translate('CREDENTIAL_ERR_TEXT')});
          console.log(error);
        });
    };

    $scope.cancel = function () {
      $scope.userName = '';
      $scope.password = '';
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

  }]);
