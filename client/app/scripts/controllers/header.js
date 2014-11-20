'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('HeaderCtrl', ['$scope', '$location','authenticationService',function ($scope, $location, authenticationService) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
}]);
