'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:WatchCtrl
 * @description
 * # WatchCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('WatchCtrl',['$scope','$routeParams','$location', '$sce', 'multimediaService', 'playlistService',
    function ($scope,$routeParams,$location, $sce, multimediaService, playlistService) {
      $scope.multimedia = {};
      $scope.synmarks=[];
      $scope.playseq = [];
      $scope.playlists; //the playlists user have created, own't be presented if not loggedin
      $scope.playlist; // the playlist that is currently playing, won't be presented if the video is not played in a playlist
      $scope.API;
      $scope.currentTime;
      $scope.timeLeft;
      $scope.duration;
      $scope.videos = [];

      var init = function() {
        var mmid = $routeParams.mmid;
        var plid = $routeParams.plid;

        multimediaService.getMultimedia(mmid, 1)
          .then(function (data) {
            $scope.multimedia = data.multimedia;
            $scope.synmarks = data.synmarks;
            $scope.playlists = data.playlists;
            $scope.duration = data.multimedia.duration;
            $scope.videos = [{
              sources:[
                {src: data.multimedia.url}
              ]
            }]

            $scope.config = {
              autoHide: false,
              autoPlay: true,
              loop: false,
              preload: "auto",
              transclude: true,
              theme: {
                url: "bower_components/videogular-themes-default/videogular.min.css"
              }
            };

            $scope.API.sources = $scope.videos[0].sources;

            $scope.tags = "";
            for(var i=0; i<$scope.multimedia.tags.length;i++){
              $scope.tags+=$scope.multimedia.tags[i].text;
              if(i<$scope.multimedia.tags.length-1)
                $scope.tags+=",";
            }

            for(var i=0;i<$scope.synmarks.length;i++) {
              var mf = {};
              mf.st = $scope.synmarks[i].mfst;
              mf.et = $scope.synmarks[i].mfet;
              $scope.playseq.push(mf);
            }
          });


        if (plid) {
          playlistService.getPlaylist(1)
            .then(function (data) {
              $scope.playlist = data;
            });
        }
      }

      $scope.onPlayerReady = function (API) {
        $scope.API = API;
      };

      init();

      //$scope.$watch
      //onsourcechange, get the multimedia info again for another video including the synmarks
  }]);
