'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:PlaylistEditCtrl
 * @description
 * # PlaylistEditCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('PlaylistEditCtrl', ['$scope', '$routeParams','$filter', '$location','messageCenterService','authenticationService','playlistService',  function ($scope, $routeParams, $filter, $location, messageCenterService, authenticationService, playlistService){

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
        messageCenterService.add('danger',error);
      })

    $scope.timeAgo = function(time){
      return moment(time).fromNow();
    }

    $scope.updateIndex = function(item,oldInd){

      //the bind option is a string, so we need to parse it to int
      //item.ind = parseInt(item.ind);
      var newInd = item.ind;

      if(item.ind === oldInd) return;

      if(item.ind> oldInd){ //move down the list
        var beforeItems = $scope.items.filter(function(i){
          return i.ind<=newInd && i.ind>oldInd && i.id !== item.id;
        });

        for(var i=0;i<beforeItems.length;i++){
          beforeItems[i].ind--;
        }
      }
      else{ //move up the list
        var afterItems = $scope.items.filter(function(i){
          return i.ind>=newInd && i.ind<oldInd && i.id !== item.id;
        });

        for(var i=0;i<afterItems.length;i++){
          afterItems[i].ind++;
        }
      }
    };

    $scope.removePlaylistItem = function(item){
      var indexes = $scope.items.map(function(i,index){
        if(i.id === item.id)
          return index;
      }).filter(function(i){ return i;});

      var index = indexes[0];

      var afterItems = $scope.items.filter(function(i){
        return i.ind-1>=index;
      });

      for(var i=0;i<afterItems.length;i++){
        afterItems[i].ind--;
      }

      $scope.items.splice(indexes[0],1);
      //item.ind = -1;
    };

    $scope.savePlaylistItems = function(){
      $scope.getPromise = playlistService.savePlaylistItems($scope.items, $scope.plid)
        .then(function(data){
          messageCenterService.add('success', $translate('UPDATE_PLAYLIST_SUCCESS_TEXT'),{timeout:3000});
        }, function(error){
          messageCenterService.add('error', error,{timeout:3000});
        });
    };

    $scope.playPlaylist = function(){
      if($scope.items.length>0){
        $location.path('watch/'+$scope.items[0].multimedia.id+'/'+$scope.items[0].id);
      }
    }
  }]);
