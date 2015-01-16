'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:WatchCtrl
 * @description
 * # WatchCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('WatchCtrl',['$scope','$filter', '$routeParams','$location', '$sce', '$timeout', '$document','multimediaService', 'playlistService', 'synmarkService','utilService','authenticationService','toaster',
    function ($scope,$filter, $routeParams,$location, $sce, $timeout,$document, multimediaService, playlistService, synmarkService, utilService, authenticationService, toaster) {

      var $translate = $filter('translate');

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

      $scope.synmarkDisplay = {}; //synmark display configuration object
      $scope.synmarkDisplay.all = true; //display all synmarks or just the synmarks in the playlist
      $scope.synmarkDisplay.mine = false; //display anyone's synmarks or just my synmarks
      $scope.currentEditingSynmark = null; //the current synmark under editing
      $scope.synmarkContent = ""; //rich text synmark content
      $scope.synmarkTagsStr = ""; //synmark tags string
      $scope.synmarkMfst = ""; //synmark start time
      $scope.synmarkMfet = ""; //synmark endd time
      $scope.showEditingSynmarkForm = false //show synmark editing form or not


      //$scope.hidePlaylist = true;
      //$scope.showPlaylistSynmarkOnly = false;

      $scope.secondsToHHMMSS = function(seconds){
        if(!seconds)
          return "";
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

      /*synmark functions*/
      $scope.showSynmarkForm = function(){
        if(!$scope.showEditingSynmarkForm){
          $scope.showEditingSynmarkForm = true;
          $scope.currentEditingSynmark = {}
        }
      }

      $scope.editSynmark = function(synmark){
        $scope.showEditingSynmarkForm = true;
        var synmarkFormDiv = angular.element(document.getElementById('synmarks_div'));
        $document.scrollToElementAnimated(synmarkFormDiv);

        //let currentEditingSynmark reference to the current synmark
        //Every change to the currentEditingSynmark will will also change the synmark in $scope.synmarks list
        $scope.currentEditingSynmark = synmark;
        $scope.synmarkMfst = $scope.secondsToHHMMSS(synmark.mfst);
        $scope.synmarkMfet = $scope.secondsToHHMMSS(synmark.mfet);
        $scope.synmarkContent = synmark.content;
        $scope.synmarkTagsStr = synmark.tags.map(function(tag){ //TODO: it's better to use a specific id instead of class
          $('.tagsinput').tagsinput('add',tag.text);
          return tag.text;
        }).toString();

      }

      $scope.deleteSynmark = function(synmark){

      }

      $scope.cancelSynmarkEditing = function(){
        $scope.showEditingSynmarkForm = false;
        $scope.synmarkContent = ""; //rich text synmark content
        $scope.synmarkTagsStr = ""; //synmark tags string
        $scope.currentEditingSynmark = null;
      }

      $scope.setSynmarkMfst = function(){
        $scope.currentEditingSynmark.mfst = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
      }

      $scope.setSynmarkMfet = function(){
        $scope.currentEditingSynmark.mfet = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
      }

      $scope.canCreateSynmark = function(){
        return authenticationService.isLoggedIn();
      }

      $scope.canEditSynmark = function(synmark){
        if(authenticationService.isLoggedIn() && synmark.owner && synmark.owner.id == authenticationService.getUserInfo().id){
          return true;
        }
        return false;
      }

      $scope.processSynmarkForm = function(){
        var mfst = utilService.HHMMSSToSeconds($scope.synmarkMfst);
        if(isNaN(mfst)){
          $scope.showToaster("error","error",$translate('SYNMARK_ST_ERROR'), 3000);
        }
        var mfet = utilService.HHMMSSToSeconds($scope.synmarkMfet);
        if(isNaN(mfet)){
          $scope.showToaster("error","error",$translate('SYNMARK_ET_ERROR'), 3000);
        }

        var newSynmark = {};
        newSynmark.id = $scope.currentEditingSynmark.id;
        newSynmark.title = $scope.currentEditingSynmark.title;
        newSynmark.owner = $scope.currentEditingSynmark.owner.id;
        newSynmark.tags = $scope.synmarkTagsStr;
        newSynmark.mfst = mfst;
        newSynmark.mfet = mfet;
        newSynmark.content = $scope.synmarkContent;
        newSynmark.annotates = $scope.multimedia.id;
        //console.log($scope.synmarkContent);
        //TODO: add more about xywh
        if(newSynmark.id){ //edit

          $scope.synmarkPromise = synmarkService.saveSynmark(newSynmark)
            .then(function (result) {
              //push the new synmark into synmarklist
              //result.synmark.owner = authenticationService.getUserInfo();
              //result.synamrk.tags = $scope.synmarkTagsStr.split(',').map(function (tagText) {
              // return {text: tagText}
              //});

              //console.log(result.synmark.tags);
              //find the edited synmark in the list and replace it
              /*var editedSynmark = null;
              for(var i=0;i<$scope.synmarks.length;i++){
                if($scope.synmarks[i].id === result.synmark.id){
                  console.log('dddddddd:'+result.synmark.id)
                  $scope.synmarks[i]=result.synmark;
                  break;
                }
              }*/
              $scope.currentEditingSynmark.tags = $scope.synmarkTagsStr.split(',').map(function (tagText) {
                 return {text: tagText}
              });
              $scope.currentEditingSynmark.mfst = mfst;
              $scope.currentEditingSynmark.mfet = mfet;
              $scope.currentEditingSynmark.content = $scope.synmarkContent;

              $scope.showToaster("success","success",$translate('SAVE_SYNMARK_SUCCESS_TEXT'), 3000);
              $scope.cancelSynmarkEditing();
            }, function (error) {
              $scope.showToaster("error","error",error, 3000);
              //do nothing
            });
        }
        else{//create new one
          $scope.synmarkPromise = synmarkService.createSynmark(newSynmark)
            .then(function (result) {
              //push the new synmark into synmarklist
              result.synmark.owner = authenticationService.getUserInfo();
              if(result.synmark.tags.length > 0)
                result.synamrk.tags = $scope.synmarkTagsStr.split(',').map(function(tagText){
                  return {text:tagText}
                });
              $scope.synmarks.push(result.synmark);
              $scope.showToaster("success","success",$translate('CREATE_SYNMARK_SUCCESS_TEXT'), 3000);
              $scope.cancelSynmarkEditing();
            }, function (error) {
              $scope.showToaster("error","error",error, 3000);
              //do nothing
            });
        }
      }

      /*synmark functions end*/

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

        $('.tagsinput').tagsinput();

        $scope.loadPromise = multimediaService.getMultimedia(mmid, pliid)
          .then(function (data) {
            $scope.multimedia = data.multimedia;
            $scope.synmarks = data.synmarks;

            if(data.playlistItem){
              $scope.hidePlaylist = false;
              $scope.synmarkDisplay.all = false;

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
