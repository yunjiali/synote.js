'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:MultimediaCreateCtrl
 * @description
 * # MultimediaCreateCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('MultimediaCreateCtrl', ["$scope","$filter","$location","multimediaService", "utilService",'messageCenterService','authenticationService',
      function ($scope,$filter, $location, multimediaService,utilService,messageCenterService,authenticationService) {

    var $translate = $filter('translate');

    $scope.metadata;
    $scope.url;
    $scope.durationStr = "";
    $scope.tagsStr = "";
    $scope.subtitles = [];

    $scope.getMetadata = function(){
      messageCenterService.reset();
      //http to get metadata
      $scope.inspectPromise = multimediaService.getMetadata($scope.url,true)
        .then(function (result) {
          $scope.metadata = result.metadata;
          if(result.subtitles) {
            $scope.subtitles = result.subtitles.list.map(function (subtitle) {
              return {language: subtitle.language, url: subtitle.url, selected: false}
            });
          }
          $scope.durationStr = utilService.secondsToHHMMSS($scope.metadata.duration);
          //console.log(result);
          $('.tagsinput').tagsinput();
        }, function (error) {
          //console.log(error);
          if(error)
            messageCenterService.add('danger', error);
        });
    }

    $scope.processForm = function(){
      messageCenterService.reset();
      //deal with duration, don't need to, it's already there
      //deal with tags, don't need to, just put the string in, the server side will deal with it.
      $scope.metadata.url = $scope.url;
      $scope.metadata.tags = $scope.tagsStr;
      if($scope.subtitles.length>0) {
        $scope.metadata.subtitles = [];
        for (var i = 0; i < $scope.subtitles.length; i++) {
          if ($scope.subtitles[i].selected === true)
            $scope.metadata.subtitles.push('srt,' + $scope.subtitles[i].language + ',' + $scope.subtitles[i].url);
        }
      }
      //if($scope)
      $scope.createPromise = multimediaService.createMultimedia($scope.metadata)
        .then(function (result) {
          messageCenterService.add('success', $translate('CREATE_MM_SUCCESS_TEXT'),{timeout:3000,status: messageCenterService.status.next});
          //console.log(result);
          $location.path('/user/'+authenticationService.getUserInfo().id);
        }, function (error) {
          //console.log(error);
          messageCenterService.add('danger', error);
          //do nothing
        });
    }
  }]);
