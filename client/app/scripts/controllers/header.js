'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('HeaderCtrl', ['$scope', '$location', '$filter', 'authenticationService', 'messageCenterService',
    function ($scope, $location, $filter, authenticationService,messageCenterService) {
    //$scope.isLoggedIn =
    //console.log("haha");
    var $translate = $filter('translate');

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.isLoggedIn = function(){
      return authenticationService.isLoggedIn();
    }

    $scope.getUserInfo = function(){
      return authenticationService.getUserInfo();
    }

    $scope.logout = function () {

      authenticationService.logout()
        .then(function (result) {
          messageCenterService.add('success', $translate('LOGOUT_SUCCESS_TEXT'), { status: messageCenterService.status.next})
          $location.path('/login');
        }, function (error) {
          messageCenterService.add('success', $translate('LOGOUT_ERR_TEXT'), { status: messageCenterService.status.next})
          console.log(error);
        });
    };
}]);
