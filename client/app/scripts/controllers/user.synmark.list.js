'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:UserSynmarkListCtrl
 * @description
 * # UserSynmarkListCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('UserSynmarkListCtrl',["$scope","$filter","$location", '$document', "synmarkService", "utilService",'messageCenterService','authenticationService', function ($scope,$filter, $location,$document, synmarkService,utilService,messageCenterService,authenticationService) {
    var $translate = $filter('translate');
    //$scope.start = 1; //start record number
    //$scope.end = 10; //end record number
    $scope.userInfo = authenticationService.getUserInfo();
    $scope.query;
    if(typeof $location.search().q === 'string')
      $scope.query = decodeURIComponent($location.search().q);

    $scope.synmarks = [];
    //total records
    //current page number
    $scope.limit = 10; //items per page
    $scope.sortby = "createdAt";//sort field;
    $scope.order = "DESC";

    $scope.listSynmarkByOwner = function(query, skip,limit,sortby,order){
      $scope.listPromise = synmarkService.listSynmarkByOwner(query, skip,limit,sortby,order).then(
        function(result){
          $scope.start = result.start;
          $scope.end = result.end;
          $scope.count = result.count;
          $scope.synmarks = result.synmarks;
          $scope.currentPage = Math.floor(skip/limit)+1;
          var headerH3= angular.element(document.getElementById('mysynmark_list_header'));
          $document.scrollToElementAnimated(headerH3);
        },
        function(error){
          messageCenterService.add('danger', error);
        }
      );
    };

    $scope.pageChanged = function(){
      console.log('changed:'+$scope.currentPage);
      $scope.listSynmarkByOwner($scope.query, ($scope.currentPage-1)*$scope.limit, $scope.limit,$scope.sortby, $scope.order);
    }

    $scope.secondsToHHMMSS = function(seconds){
      return utilService.secondsToHHMMSS(seconds);
    }

    $scope.listSynmarkByOwner($scope.query,0,$scope.limit,$scope.sortby,$scope.order);

    $scope.searchSynmark = function(){
      $location.path('/user/'+$scope.userInfo.id+'/synmark/list').search('q', $scope.query);
    }

  }]);
