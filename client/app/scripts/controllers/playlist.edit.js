'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:PlaylistEditCtrl
 * @description
 * # PlaylistEditCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('PlaylistEditCtrl', ['$scope', '$routeParams','$filter', 'messageCenterService','authenticationService','playlistService',  function ($scope, $routeParams, $filter, messageCenterService, authenticationService, playlistService){

    var $translate = $filter('translate');
    $scope.plid = $routeParams.playlistId;
    $scope.playlist = null;
    $scope.isOwner = false;
    $scope.items = [];

    $scope.getPromise = playlistService.get($scope.plid)
      .then(function(data){
        $scope.playlist = data.playlist;
        $scope.items = data.items;
        if(authenticationService.isLoggedIn())
          $scope.isOwner = ($scope.playlist.owner.id===authenticationService.getUserInfo().id)?true:false;
      },function(error){
        messageServiceCenter.add('danger',error);
      })

    $scope.timeAgo = function(time){
      return moment(time).fromNow();
    }
  }]);
