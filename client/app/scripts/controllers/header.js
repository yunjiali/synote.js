'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('HeaderCtrl', ['$scope', '$location',function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
}]);
