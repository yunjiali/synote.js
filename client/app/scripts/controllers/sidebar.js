'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:SidebarCtrl
 * @description
 * # SidebarCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('SidebarCtrl', ['$scope', '$location','$filter', 'playlistService', 'authenticationService', function ($scope, $location, $filter, playlistSerivce,authenticationService) {

    var $translate = $filter('translate');
    $scope.playlists = [];
    $scope.plsMsg = "";

    if(authenticationService.isLoggedIn()){
      $scope.plsPromise = playlistSerivce.list()
        .then(function(playlists){
          $scope.playlists = playlists;
          if(playlists.length === 0)
            $scope.plsMsg = $translate('NO_PLAYLIST_TEXT');
        }, function(err){
          //do nothing
          $scope.plsMsg = $translate('FAILED_LOADING_PLAYLIST_TEXT');
        });
    }

    $scope.move = function(){
      $location.path('/playlist.create');
      return;
    }

    $scope.displayPlaylist = function(plid){
      $location.path('/playlist.edit/'+plid);
      return
    }

    $scope.isLoggedIn = function(){
      return authenticationService.isLoggedIn();
    }

  }]);
