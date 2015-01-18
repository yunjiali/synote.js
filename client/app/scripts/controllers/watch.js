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
      $scope.playlists; //the playlists user have created, won't be presented if not loggedin
      $scope.playlist; // the playlist that is currently playing, won't be presented if the video is not played in a playlist
      $scope.multimediaInPlaylists = {}; //the playlists that this multimedia has already been added with a count of added times (one multimedia can be add to one playlist more than once)
      $scope.API;
      $scope.duration;
      $scope.cuepoints = {}; //the play sequence object based on chained synmarks
      $scope.cuepoints.current = null; //the current index of chained synmarks
      $scope.cuepoints.points = [];

      $scope.synmarks=[];
      $scope.synmarkDisplay = {}; //synmark display configuration object
      $scope.synmarkDisplay.marked = $location.search().marked === "true"?true:false; //display just the synmarks in the playlist
      $scope.synmarkDisplay.mine = $location.search().mine === "true"?true:false;//display anyone's synmarks or just my synmarks
      $scope.synmarkDisplay.chained = $location.search().chained === "true"?true:false;
      $scope.currentEditingSynmark = null; //the current synmark under editing
      $scope.synmarkContent = ""; //rich text synmark content
      $scope.synmarkTagsStr = ""; //synmark tags string
      $scope.synmarkMfst = ""; //synmark start time
      $scope.synmarkMfet = ""; //synmark endd time
      $scope.showEditingSynmarkForm = false //show synmark editing form or not

      var watchAPICurrentTime = true; // a flag to stop watching watchAPICurrentTime
      var watchAPITimeLeft = true; // a flag to stop watching watchAPITimeLeft


      //$scope.hidePlaylist = true;
      //$scope.showPlaylistSynmarkOnly = false;

      //register watch for currentTime
      $scope.$watch('API.currentTime', function(newValue, oldValue){
        if(!watchAPICurrentTime)
          return;

        if(newValue == undefined || oldValue == undefined)
          return;

        if(newValue.getTime()/1000 === oldValue.getTime()/1000)
          return;

        var currentTime = newValue.getTime()/1000;
        if($scope.synmarkDisplay.chained && $scope.cuepoints.points.length>0){
          if($scope.cuepoints.current == undefined){
            $scope.cuepoints.current = $scope.cuepoints.points[0];
            $scope.API.seekTime($scope.cuepoints.current.time);
          }
          else if(currentTime<$scope.cuepoints.current.time || currentTime>$scope.cuepoints.current.end){
            //not within the current cuepoint, two options:
            //1. I have jumped to some where within another cuepoint
            //2. I have jumped (or just played) to somewhere that is not within another cuepoint in cuepoints.points
            var seqs = $scope.cuepoints.points.filter(function(seq){
              return seq.time<=currentTime && seq.end>currentTime;
            });

            if(seqs.length>0){ //find the currentTime is within one or more cuepoints
              $scope.cuepoints.current = seqs[0];
              $scope.API.seekTime($scope.cuepoints.current.time);
            }
            else{ //can't find any cuepoints within currentTime
              var nextSeqs = $scope.cuepoints.points.filter(function(seq){
                return seq.time>currentTime;
              });

              if(nextSeqs.length>0){ //find some cuepoints that are behind the currentTime, then play the first cuepoint behind the currentTime
                $scope.cuepoints.current = nextSeqs[0];
                $scope.API.seekTime($scope.cuepoints.current.time);
              }
              else{
                // can't find any cuepoint that is behind the currentTime, in this case:
                // 1. if it's a playlist, start to play the next video
                // 2. if it's not a playlist, replay the last cuepoint
                if(!$scope.playlist) {
                  $scope.cuepoints.current = $scope.cuepoints.points[$scope.cuepoints.points.length - 1];
                  $scope.API.seekTime($scope.cuepoints.current.time);
                }
                else{
                  var nextItem = $scope.nextInPlaylist();
                  if(nextItem){
                    watchAPICurrentTime = false;
                    $scope.watchPlaylistItem(nextItem.multimedia.id, nextItem.id);
                  }
                  else{
                    $scope.cuepoints.current = $scope.cuepoints.points[$scope.cuepoints.points.length - 1];
                    $scope.API.seekTime($scope.cuepoints.current.time);
                  }
                }
              }
            }
          }
        }
      });

      //register watch for timeLeft, if completed and there is a playlist, we play the last one
      //if this is the last video, we just simply stop playing
      $scope.$watch('API.timeLeft', function(newValue,oldValue){
        if(!watchAPITimeLeft)
          return;

        if(!$scope.playlist)
          return;

        if(newValue.getTime() === oldValue.getTime()) {
          return;
        }

        if(newValue.getTime()>0) {
          return;
        }

        var nextItem = $scope.nextInPlaylist();
        if(nextItem){
          console.log("nextitem");
          watchAPITimeLeft = false;
          $scope.watchPlaylistItem(nextItem.multimedia.id, nextItem.id);
        }
      });

      $scope.nextInPlaylist = function(){
        var pliid = $routeParams.pliid;
        if(!$routeParams.pliid)
          return undefined;
        else{
          var items = $scope.playlist.items.filter(function(item){
            return item.id === parseInt(pliid);
          });

          if(items.length === 0)
            return undefined;

          var ind = items[0].ind+1;

          var nextItems = $scope.playlist.items.filter(function(item){
            return item.ind === ind;
          });

          if(nextItems.length === 0){
            return undefined;
          }


          return nextItems[0];
        }
      }

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
        return;
      }

      $scope.showToaster = function(type,title, msg, time){
        //toaster.pop(type,title,msg,time);
        toaster.pop({type: type, body:msg,timeout:time})
      }

      $scope.isPlaylistItemPlaying = function(pliid){
        return $routeParams.pliid===pliid.toString();
      }

      $scope.watchPlaylistItem = function(mmid, pliid){
        $location.path('/watch/'+mmid+"/"+pliid).search("marked",$scope.synmarkDisplay.marked).search("mine",$scope.synmarkDisplay.mine).search("chained",$scope.synmarkDisplay.chained);
        return;
      }

      /*synmark functions*/
      $scope.showSynmarkForm = function(){
        if(!$scope.showEditingSynmarkForm){
          $scope.showEditingSynmarkForm = true;
          $scope.currentEditingSynmark = {}
        }
      }

      $scope.editSynmark = function(synmark,$event){
        $event.stopPropagation(); //stop the synmark click event to propagate to the whole synmark div
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

      $scope.deleteSynmark = function(synmark,$event){
        $event.stopPropagation(); //stop the synmark click event to propagate to the whole synmark div
        $scope.synmarkPromise = synmarkService.deleteSynmark(synmark)
          .then(function (result) {
            //remove it from $scope.synmarks
            $scope.synmarks = $scope.synmarks.filter(function(syn){
              return syn.id !== synmark.id;
            })
            $scope.showToaster("success","success",$translate('DELETE_SYNMARK_SUCCESS_TEXT'), 3000);
          }, function (error) {
            $scope.showToaster("error","error",error, 3000);
            //do nothing
          });
      }

      //play the current synmark
      $scope.playSynmark = function(synmark){
        var st = synmark.mfst;
        $scope.API.seekTime(st,false);
      }

      $scope.cancelSynmarkEditing = function(){
        $scope.showEditingSynmarkForm = false;
        $scope.synmarkContent = ""; //rich text synmark content
        $scope.synmarkTagsStr = ""; //synmark tags string
        $scope.currentEditingSynmark = null;
      }

      $scope.setSynmarkMfst = function(){
        $scope.synmarkMfst = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
      }

      $scope.setSynmarkMfet = function(){
        $scope.synmarkMfet = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
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

      //click the "marked" button in button-group
      $scope.toggleMarked = function(){
        $scope.refreshSynmarkDisplay();
      }

      //click the "mine" button in button-group
      $scope.toggleMine = function(){
        $scope.refreshSynmarkDisplay();
      }

      //click the "chain" button in button-group
      $scope.toggleChained = function(){
        //play the video second after second or synmark after synmark
        if($scope.synmarkDisplay.chained){
          //scan synmarks and changed
          var chainedSynmarks = $scope.synmarks.filter(function(synmark){
            return synmark.display === true;
          });

          var cuepoints = chainedSynmarks.map(function(synmark){
            return {time:synmark.mfst, end:synmark.mfet};
          });

          $scope.cuepoints.points = cuepoints.sort(function(a,b){
            return (a.time - b.time !== 0)?(a.time - b.time):(a.end- b.end);
          });
        }
        else{ //clean all the chained cuepoints
          $scope.cuepoints.points = [];
        }
      }

      $scope.refreshSynmarkDisplay = function(){ //refresh the displayed synmarks based on synmarkDisplay object
        for(var i=0;i<$scope.synmarks.length;i++){
          if($scope.synmarkDisplay.marked && $scope.synmarkDisplay.mine){
            if($scope.synmarks[i].marked && $scope.synmarks[i].owner.id === authenticationService.getUserInfo().id){
              $scope.synmarks[i].display = true;
            }
            else{
              $scope.synmarks[i].display = false;
            }
          }
          else if(!$scope.synmarkDisplay.marked && $scope.synmarkDisplay.mine){
            if($scope.synmarks[i].owner.id === authenticationService.getUserInfo().id){
              $scope.synmarks[i].display = true;
            }
            else{
              $scope.synmarks[i].display = false;
            }
          }
          else if($scope.synmarkDisplay.marked && !$scope.synmarkDisplay.mine){
            if($scope.synmarks[i].marked){
              $scope.synmarks[i].display = true;
            }
            else{
              $scope.synmarks[i].display = false;
            }
          }
          else{
            $scope.synmarks[i].display = true;
          }
        }
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
        newSynmark.owner = $scope.currentEditingSynmark.owner?$scope.currentEditingSynmark.owner.id:authenticationService.getUserInfo.id;
        newSynmark.tags = $scope.synmarkTagsStr;
        newSynmark.mfst = mfst;
        newSynmark.mfet = mfet;
        newSynmark.content = $scope.synmarkContent;
        newSynmark.annotates = $scope.multimedia.id;
        newSynmark.mmid = $scope.multimedia.id;
        //console.log($scope.synmarkContent);
        //TODO: add more about xywh
        if(newSynmark.id){ //edit

          $scope.synmarkPromise = synmarkService.saveSynmark(newSynmark)
            .then(function (result) {
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
              if($scope.synmarkTagsStr.length>0)
                result.synmark.tags = $scope.synmarkTagsStr.split(',').map(function(tagText){
                  return {text:tagText}
                });

              $scope.synmarks.push(result.synmark);
              $scope.showToaster("success","success",$translate('CREATE_SYNMARK_SUCCESS_TEXT'), 3000);
              $scope.cancelSynmarkEditing();

              //if synmarkDisplay.marked === true
              //also add this synmark to playlistitem
              if($scope.synmarkDisplay.marked === true){
                result.synmark.marked = true;
              }
              else {
                result.synmark.marked = false;
              }

              result.synmark.display = true;

            }, function (error) {
              $scope.showToaster("error","error",error, 3000);
              //do nothing
            });
        }
      }

      $scope.shouldSynmarkHighlighted = function(synmark){
        var ct = $scope.API.currentTime.getTime()/1000;
        if(synmark.mfst<ct && synmark.mfet>ct){
          return true;
        }
        else{
          return false;
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
              $scope.synmarkDisplay.marked = false;

              $scope.playlist = data.playlistItem.playlist;
            }

            $scope.refreshSynmarkDisplay();

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
