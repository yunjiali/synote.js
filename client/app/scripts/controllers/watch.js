'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:WatchCtrl
 * @description
 * # WatchCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('WatchCtrl',['$scope','$routeParams','$location', '$sce', '$timeout', 'multimediaService', 'playlistService', 'utilService','toaster',
    function ($scope,$routeParams,$location, $sce, $timeout, multimediaService, playlistService, utilService, toaster) {
      $scope.videoError = false;
      $scope.multimedia = {};
      $scope.synmarks=[];
      $scope.playseq = [];
      $scope.playlists; //the playlists user have created, won't be presented if not loggedin
      $scope.playlist; // the playlist that is currently playing, won't be presented if the video is not played in a playlist
      $scope.multimediaInPlaylists = {}; //the playlists that this multimedia has already been added with a count of added times (one multimedia can be add to one playlist more than once)
      $scope.API;
      $scope.currentTime;
      $scope.timeLeft;
      $scope.duration;

      //$scope.hidePlaylist = true;
      //$scope.showPlaylistSynmarkOnly = false;

      $scope.secondsToHHMMSS = function(seconds){
        return utilService.secondsToHHMMSS(seconds);
      }

      $scope.isEmptyObject= function(obj){
        return utilService.isEmptyObject(obj);
      }

      $scope.displayPlaylist = function(plid){
        $location.path('/playlist.edit/'+plid);
        return
      }

      $scope.showToaster = function(type,title, msg, time){
        //toaster.pop(type,title,msg,time);
        toaster.pop({type: type, body:msg,timeout:time})
      }

      $scope.isPlaylistItemPlaying = function(pliid){
        return $routeParams.pliid===pliid.toString();
      }

      $scope.watchPlaylistItem = function(mmid, pliid){
        $location.path('/watch/'+mmid+"/"+pliid);
        return
      }

      var updateCurrentPlaylist = function(plid){
        $scope.loadPlaylistPromise = playlistService.get(plid)
          .then(function (data) {
            $scope.playlist = data;
          },function(error){
            console.log(error);
          });
      }

      var init = function() {
        var mmid = $routeParams.mmid;
        var pliid = $routeParams.pliid;

        $scope.loadPromise = multimediaService.getMultimedia(mmid, pliid)
          .then(function (data) {
            $scope.multimedia = data.multimedia;
            $scope.synmarks = data.synmarks;

            if(data.playlistItem){
              $scope.hidePlaylist = false;
              $scope.showPlaylistSynmarkOnly = true;

              $scope.playlist = data.playlistItem.playlist;
            }

            $scope.duration = data.multimedia.duration;

            if(data.multimedia.url == undefined){
              $scope.videoError = true;
            }
            else {
              if (utilService.isYouTubeURL(data.multimedia.url, true)) {
                $scope.videos = [{
                  sources: [
                    //{src: $sce.trustAsResourceUrl(data.multimedia.url), type:"video/webm"}
                    {src: data.multimedia.url}
                  ]
                }];
              }
              else {
                var type = utilService.getVideoMIMEType(data.multimedia.url);
                if (type == null) {
                  $scope.videoError = true;
                  return;
                }

                $scope.videos = [{
                  sources: [
                    {src: $sce.trustAsResourceUrl(data.multimedia.url), type: type}
                  ]
                }];
              }

              $scope.config = {
                autoHide: true,
                autoPlay: true,
                loop: false,
                preload: "auto",
                transclude: true,
                sources:$scope.videos[0].sources,
                theme: "bower_components/videogular-themes-default/videogular.css"
              };

              if(utilService.isYouTubeURL(data.multimedia.url, true) && $scope.config.autoPlay === true){
                setTimeout(function(){ //autoplay for youtube video
                  $scope.API.play();
                },2000);
              }
            }

            //tidy synmarks data
            for(var i=0;i<$scope.synmarks.length;i++) {
              var mf = {};
              mf.st = $scope.synmarks[i].mfst;
              mf.et = $scope.synmarks[i].mfet;
              $scope.playseq.push(mf);
            }

            playlistService.list().then(
              function(playlists){
                $scope.playlists = playlists; //could be undefined if not loggedin
                if(typeof $scope.playlists !=="undefined"){
                  for(var i=0;i<$scope.playlists.length;i++){
                    var playlist = $scope.playlists[i];
                    for(var j=0;j<playlist.items.length;j++){
                      if(playlist.items[j].multimedia === $scope.multimedia.id){
                        if($scope.multimediaInPlaylists[playlist.id] === undefined){
                          $scope.multimediaInPlaylists[playlist.id] = {title:playlist.title, count:1};
                        }
                        else{
                          $scope.multimediaInPlaylists[playlist.id].count++;
                        }
                      }
                    }
                  }
                  //console.log($scope.multimediaInPlaylists);
                }
              }, function(plError){
                console.log(plError);
              }
            )

            //init the switch
            $('.switch').bootstrapSwitch();

          }, function(error){
            console.log(error);
          });
      }

      init();

      $scope.onPlayerReady = function (API) {
        //console.log("ready");
        $scope.API = API;

        if ($scope.API.currentState === 'play' || $scope.isCompleted) $scope.API.play();

        $scope.isCompleted = false;
      };

      $scope.onCompleteVideo = function() {
        $scope.isCompleted = true;

        $scope.currentVideo++;

        if ($scope.currentVideo >= $scope.videos.length) $scope.currentVideo = 0;

        $scope.setVideo($scope.currentVideo);
      };


      /*$scope.changeSource = function(index){
        //console.log("change");
        $scope.API.pause();
        console.log($scope.videos[index].sources);
        if(($scope.videos[index].sources)[0].type === "video/youtube"){ //for youtube plugin
          $scope.API.sources = $scope.videos[index].sources;
        }
        $scope.sources = $scope.videos[index].sources;

        $timeout(function() {
          if ($scope.config.autoPlay) {
            //console.log($scope.API.currentState);
            //$scope.API.play();
          }
        });
      }*/

      $scope.changeSource = function(mmid){
        //console.log("change");
        $location.path('/watch/'+mmid+($routeParams.plid?"/"+$routeParams.plid:""));
      }

      $scope.addToPlaylist= function(pl){
        $scope.addToPlaylistPromise = playlistService.additem(pl.id, $scope.multimedia.id).then(
          function(result){
            if(result.success === true){
              //change the count
              if($scope.multimediaInPlaylists[pl.id] === undefined){
                $scope.multimediaInPlaylists[pl.id] = {title:pl.title, count:1};
              }
              else{
                $scope.multimediaInPlaylists[pl.id].count++;
              }

              if(pl.id === playlist.playlist.id){ //refresh the current playlist because the video is added to the current playlist
                updateCurrentPlaylist(pl.id);
              }
              $scope.showToaster("success","success",result.message, 3000);
            }
            else{
              $scope.showToaster("error","error",result, 3000);
            }
          },
          function(error){
            $scope.showToaster("error","error",error, 6000);
          }

        )
      }

      //$scope.$watch
      //onsourcechange, get the multimedia info again for another video including the synmarks
  }]);
