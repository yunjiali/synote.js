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
    var $translate = $filter('translate');
    //$scope.start = 1; //start record number
    //$scope.end = 10; //end record number
    $scope.mms = [];
    //total records
    //current page number
    $scope.limit = 10; //items per page
    $scope.sortby = "createdAt";//sort field;
    $scope.order = "DESC";

    $scope.listMultimediaByOwner = function(skip,limit,sortby,order){
      $scope.listPromise = multimediaService.listMultimediaByOwner(skip,limit,sortby,order).then(
        function(result){
          console.log(result);
          $scope.start = result.start;
          $scope.end = result.end;
          $scope.count = result.count;
          $scope.mms = result.mms;
          $scope.currentPage = Math.floor(skip/limit)+1;
        },
        function(error){
          messageCenterService.add('danger', error);
        }
      );
    };

    $scope.pageChanged = function(){
      //console.log('changed:'+$scope.currentPage);
      $scope.listMultimediaByOwner(($scope.currentPage-1)*$scope.limit, $scope.limit,$scope.sortby, $scope.order);
    }

    $scope.secondsToHHMMSS = function(seconds){
      return utilService.secondsToHHMMSS(seconds);
    }

    $scope.listMultimediaByOwner(0,$scope.limit,$scope.sortby,$scope.order);

  }]);
