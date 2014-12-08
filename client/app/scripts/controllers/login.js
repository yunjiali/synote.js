'use strict';

/**
 * @ngdoc function
 * @name synoteClient.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('LoginCtrl',  ['$scope', '$location', '$window', '$filter', 'authenticationService', 'messageCenterService',
      function ($scope, $location, $window, $filter, authenticationService, messageCenterService) {
    $scope.userInfo = null;
    var $translate = $filter('translate');

    $scope.login = function () {
      authenticationService.login($scope.email, $scope.password)
        .then(function (userInfo) {
          $scope.userInfo = userInfo;
          //console.log(userInfo.id);
          $location.path('/user/'+userInfo.id);
        }, function (error) {
          messageCenterService.add('danger',$translate('CREDENTIAL_ERR_TEXT'));
          console.log(error);
        });
    };

    $scope.cancel = function () {
      $scope.email = '';
      $scope.password = '';
    };

  }]);
