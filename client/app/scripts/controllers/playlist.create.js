'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:PlaylistCreateCtrl
 * @description
 * # PlaylistCreateCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('PlaylistCreateCtrl', ['$scope','$filter','$location', 'playlistService','messageCenterService',
      function ($scope,$filter, $location, playlistService,messageCenterService) {

    var $translate = $filter('translate');
    $scope.formdata = {};

    $scope.processForm = function(){
      //deal with duration, don't need to, it's already there
      //deal with tags, don't need to, just put the string in, the server side will deal with it.
      messageCenterService.reset();
      if(!$scope.formdata.title) {
        messageCenterService.add('danger', $translate('PLAYLIST_TITLE_ERR_TEXT'));
      }
      else if(!$scope.formdata.description) {
        messageCenterService.add('danger', $translate('PLAYLIST_DESCRIPTION_ERR_TEXT'));
      }
      //if($scope)
      $scope.createPromise = playlistService.create($scope.formdata)
        .then(function (data) {
          messageCenterService.add('success', $translate('CREATE_PLAYLIST_SUCCESS_TEXT'),{timeout:3000, status: messageCenterService.status.next});
          //console.log(result);
          $location.path('/playlist.edit/'+data.plid);
        }, function (error) {
          //console.log(error);
          //messageCenterService.add('danger', error);
          //do nothing
          messageCenterService.add('danger', error);

        });
    }

  }]);
