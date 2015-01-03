'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:UserMultimediaListCtrl
 * @description
 * # UserMultimediaListCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('UserMultimediaListCtrl',["$scope","$filter","$location", "multimediaService", "utilService",'messageCenterService','authenticationService', function ($scope,$filter, $location, multimediaService,utilService,messageCenterService,authenticationService) {
    $scope.mms=[];
    //var getMMPromise = multimediaService.getMultimedia;


  }]);
