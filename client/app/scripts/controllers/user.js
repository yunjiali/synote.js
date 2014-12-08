'use strict';

/**
 * @ngdoc function
 * @name synoteClient.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('UserCtrl', ['$scope','authenticationService', 'messageCenterService',
      function ($scope, authenticationService, messageCenterService) {

        $scope.userInfo = authenticationService.getUserInfo();
  }]);
