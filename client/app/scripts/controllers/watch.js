'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:WatchCtrl
 * @description
 * # WatchCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('WatchCtrl',['$scope','$filter', '$routeParams','$location', '$sce', '$timeout', '$document','matchmedia','multimediaService', 'playlistService', 'synmarkService','Transcript','Cue','utilService','authenticationService','toaster','ENV',
    function ($scope,$filter, $routeParams,$location, $sce, $timeout,$document, matchmedia, multimediaService, playlistService, synmarkService, Transcript, Cue, utilService, authenticationService, toaster,ENV) {

      var $translate = $filter('translate');

      //get the device first
      $scope.isTablet = matchmedia.isTablet();
      $scope.isPhone = matchmedia.isPhone();
      $scope.isDesktop = matchmedia.isDesktop();

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
      $scope.showMMDescription =  false;
      $scope.toggleShowMMDescriptionText = "More..."
      $scope.showAddToPlaylist=false;
      $scope.displaySettings = {};
      $scope.displaySettings.showSynmarks = true; //show synmark by default
      $scope.displaySettings.showPlaylist = true; //show playlist by default
      $scope.displaySettings.showTranscripts = true; //show transcripts by default
      $scope.displaySettings.showMMInfo = true; //show multimedia information by default


      $scope.st; //starttime
      $scope.stPlayed = true; //indicate whether the video has started playing from st yet, if no, we will jump to st when we monitor API.currentTime
      if(typeof $location.search().st === 'string' && !isNaN(parseInt($location.search().st))) {
        $scope.st = parseInt($location.search().st);
        $scope.stPlayed = false;
      }

      $scope.synmarks=[];
      $scope.synmarkDisplay = {}; //synmark display configuration object
      $scope.synmarkDisplay.marked = $location.search().marked === "true"?true:false; //display just the synmarks in the playlist
      $scope.synmarkDisplay.mine = $location.search().mine === "true"?true:false;//display anyone's synmarks or just my synmarks
      $scope.synmarkDisplay.chained = $location.search().chained === "true"?true:false;
      $scope.synmarkDisplay.tabactive = true; // whether the synmark tab is active
      $scope.synmarkDisplay.focusView = false; //display only synmarks related to the current time
      $scope.showEditingSynmarkForm = false //show synmark editing form or not
      $scope.currentEditingSynmark = {}; //the current synmark under editing
      $scope.currentEditingSynmark.synmarkContent = ""; //rich text synmark content
      $scope.currentEditingSynmark.synmarkTagsStr = ""; //synmark tags string
      $scope.currentEditingSynmark.synmarkMfst = ""; //synmark start time
      $scope.currentEditingSynmark.synmarkMfet = ""; //synmark end time


      $scope.transcripts;
      $scope.selectedTranscript;
      $scope.currentCue;//the current cue that need to be highlighted and displayed under the video.
      $scope.currentEditingCue; //the cue that is editing
      $scope.showEditingTranscriptForm = false //show transcript editing form or not
      $scope.showEditingCueForm = false //show cue editing form or not
      $scope.transcriptObj={}; //the ng-model for creating new transcript

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
        //if no chain or marked synmark to be played, we will look at whether there is an initial start time (st)
        else if(!$scope.stPlayed){ //if the video hasn't been started playing from the $scope.st, start playing
          $scope.API.seekTime($scope.st);
          $scope.stPlayed = true;
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
          return "00:00:00";
        return utilService.secondsToHHMMSS(seconds);
      }

      $scope.isEmptyObject= function(obj){
        return utilService.isEmptyObject(obj);
      }

      $scope.displayPlaylist = function(plid){
        $location.path('/playlist.edit/'+plid);
        return;
      }

      $scope.calcCuepointVizLeft = function(cuepoint) {
        if ($scope.API.totalTime === 0) return '-1000';

        var videoLength = $scope.API.totalTime.getTime() / 1000;
        return "left:"+(cuepoint.time * 100 / videoLength).toString()+"%";
      };

      $scope.showToaster = function(type,title, msg, time){
        //toaster.pop(type,title,msg,time);
        toaster.pop({type: type, body:msg,timeout:time})
      }

      $scope.isPlaylistItemPlaying = function(pliid){
        return $routeParams.pliid===pliid.toString();
      }

      $scope.watchPlaylistItem = function(mmid, pliid){
        $location.path('/watch/'+mmid+"/"+pliid).search("marked",$scope.synmarkDisplay.marked.toString()).search("mine",$scope.synmarkDisplay.mine.toString()).search("chained",$scope.synmarkDisplay.chained.toString());
        return;
      }

      /* responsive design methods */
      matchmedia.onDesktop(function(mediaQueryList){
        $scope.isDesktop = mediaQueryList.matches;
        //show everything
        $scope.displaySettings.showSynmarks = true;
        $scope.displaySettings.showPlaylist = true;
        $scope.displaySettings.showTranscripts = true;
        $scope.displaySettings.showMMInfo = true;

      });

      $scope.toggleShowMMDescription = function(){
        if(!$scope.showMMDescription){
          $scope.toggleShowMMDescriptionText = "Less..."
        }
        else{
          $scope.toggleShowMMDescriptionText = "More..."
        }

        $scope.showMMDescription =!$scope.showMMDescription;
        return;
      };

      $scope.toggleShowAddToPlaylist = function(){
        $scope.showAddToPlaylist =!$scope.showAddToPlaylist;
      };

      /* /responsive design methods */

      /*synmark functions*/

      //create a new synmark
      $scope.showSynmarkForm = function(){
        if(!$scope.showEditingSynmarkForm){ //if not shown at the moment, it's not editing synmark, so we need to create a new synmark
          $scope.showEditingSynmarkForm = true;
          $scope.currentEditingSynmark = {}
          $scope.currentEditingSynmark.synmarkContent = "";
          $scope.currentEditingSynmark.synmarkTagsStr = "";
          $('.tagsinput').tagsinput('removeAll');
        }

        $scope.setSynmarkMfst();
        $scope.setSynmarkMfet();
        $scope.API.pause();
      }

      $scope.showSynmarkFormFromOutside = function(){ //click create synmark button from outside of synmark tab
        $scope.synmarkDisplay.tabactive = true;
        $scope.showSynmarkForm();
      }

      //edit a synmark and show form
      $scope.editSynmark = function(synmark,$event){
        $event.stopPropagation(); //stop the synmark click event to propagate to the whole synmark div
        $scope.showEditingSynmarkForm = true;
        var synmarkFormDiv = angular.element(document.getElementById('synmarks_div'));
        $document.scrollToElementAnimated(synmarkFormDiv); //score to the correct page position

        //let currentEditingSynmark reference to the current synmark
        //Every change to the currentEditingSynmark will will also change the synmark in $scope.synmarks list
        $scope.currentEditingSynmark = synmark;
        $scope.currentEditingSynmark.synmarkMfst = $scope.secondsToHHMMSS(synmark.mfst);
        $scope.currentEditingSynmark.synmarkMfet = $scope.secondsToHHMMSS(synmark.mfet);
        $scope.currentEditingSynmark.synmarkContent = synmark.content;
        $scope.currentEditingSynmark.synmarkTagsStr = synmark.tags.map(function(tag){ //TODO: it's better to use a specific id instead of class
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

      $scope.addSynmarkToPlaylistItem=function(synmark,$event){
        $event.stopPropagation(); //stop the synmark click event to propagate to the whole synmark div
        var pliid = $routeParams.pliid;
        if(!pliid)
          return;
        $scope.synmarkPromise = synmarkService.addToPlaylistItem(synmark, pliid)
          .then(function (result) {
            //remove it from $scope.synmarks
            synmark.marked =  true;
            $scope.refreshSynmarkDisplay();
            $scope.showToaster("success","success",$translate('ADD_SYNMARK_TO_PLAYLIST_SUCCESS_TEXT'), 3000);
          }, function (error) {
            $scope.showToaster("error","error",error, 3000);
            //do nothing
          });
      }

      $scope.removeSynmarkFromPlaylistItem=function(synmark,$event){
        $event.stopPropagation(); //stop the synmark click event to propagate to the whole synmark div
        var pliid = $routeParams.pliid;
        if(!pliid)
          return;
        $scope.synmarkPromise = synmarkService.removeFromPlaylistItem(synmark, pliid)
          .then(function (result) {
            //remove it from $scope.synmarks
            synmark.marked =  false;
            $scope.refreshSynmarkDisplay();
            $scope.showToaster("success","success",$translate('REMOVE_SYNMARK_TO_PLAYLIST_SUCCESS_TEXT'), 3000);
          }, function (error) {
            $scope.showToaster("error","error",error, 3000);
            //do nothing
          });
      }

      //play the current synmark
      $scope.playSynmark = function(synmark){
        var st = synmark.mfst;
        $scope.API.seekTime(st,false);
        var videoDiv = angular.element(document.getElementById('video_div'));
        $document.scrollToElementAnimated(videoDiv);
      }

      $scope.cancelSynmarkEditing = function(){
        $scope.showEditingSynmarkForm = false;
        $scope.currentEditingSynmark = {};
        $scope.currentEditingSynmark.synmarkContent = ""; //rich text synmark content
        $scope.currentEditingSynmark.synmarkTagsStr = ""; //synmark tags string
        $('.tagsinput').tagsinput('removeAll');
        //??Do we also need to reset synmarkMfst and synmarkMfet?
      }

      $scope.setSynmarkMfst = function(){
        $scope.currentEditingSynmark.synmarkMfst = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
      }

      $scope.setSynmarkMfet = function(){
        $scope.currentEditingSynmark.synmarkMfet = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
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

      $scope.canBeMarked = function(synmark){
        return !synmark.marked;
      }

      //click the "marked" button in button-group
      $scope.toggleMarked = function(){
        $scope.refreshSynmarkDisplay();
      }

      //click the "mine" button in button-group
      $scope.toggleMine = function(){
        $scope.refreshSynmarkDisplay();
      };

      $scope.focusViewEnabled = function(){
        return $scope.synmarkDisplay.focusView;
      };

      //click the "chain" button in button-group
      $scope.toggleChained = function(){
        //play the video second after second or synmark after synmark
        if($scope.synmarkDisplay.chained){
          $scope.refreshCuepoints();
        }
        else{ //clean all the chained cuepoints
          $scope.cuepoints.points = [];
        }
      }

      $scope.refreshCuepoints = function(){
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

        if($scope.synmarkDisplay.chained){
          $scope.refreshCuepoints();
        }
      }

      $scope.processSynmarkForm = function(){
        var mfst = utilService.HHMMSSToSeconds($scope.currentEditingSynmark.synmarkMfst);
        if(isNaN(mfst)){
          $scope.showToaster("error","error",$translate('SYNMARK_ST_ERROR'), 3000);
          return false;
        }
        var mfet = utilService.HHMMSSToSeconds($scope.currentEditingSynmark.synmarkMfet);
        if(isNaN(mfet)){
          $scope.showToaster("error","error",$translate('SYNMARK_ET_ERROR'), 3000);
          return false;
        }

        var newSynmark = {};
        newSynmark.id = $scope.currentEditingSynmark.id;
        newSynmark.title = $scope.currentEditingSynmark.title;
        newSynmark.owner = $scope.currentEditingSynmark.owner?$scope.currentEditingSynmark.owner.id:authenticationService.getUserInfo().id;
        newSynmark.tags = $scope.currentEditingSynmark.synmarkTagsStr;
        newSynmark.mfst = mfst;
        newSynmark.mfet = mfet;
        newSynmark.content = $scope.currentEditingSynmark.synmarkContent;
        newSynmark.annotates = $scope.multimedia.id;
        newSynmark.mmid = $scope.multimedia.id;
        console.log(newSynmark);
        //TODO: add more about xywh
        if(newSynmark.id){ //edit

          $scope.synmarkPromise = synmarkService.saveSynmark(newSynmark)
            .then(function (result) {
              $scope.currentEditingSynmark.tags = $scope.currentEditingSynmark.synmarkTagsStr.split(',').map(function (tagText) {
                 return {text: tagText}
              });
              $scope.currentEditingSynmark.mfst = mfst;
              $scope.currentEditingSynmark.mfet = mfet;
              $scope.currentEditingSynmark.content = $scope.currentEditingSynmark.synmarkContent;

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
              if($scope.currentEditingSynmark.synmarkTagsStr.length>0)
                result.synmark.tags = $scope.currentEditingSynmark.synmarkTagsStr.split(',').map(function(tagText){
                  return {text:tagText}
                });

              $scope.synmarks.push(result.synmark);
              $scope.showToaster("success","success",$translate('CREATE_SYNMARK_SUCCESS_TEXT'), 3000);
              $scope.cancelSynmarkEditing();

              //if synmarkDisplay.marked === true
              //also add this synmark to playlistitem
              if($scope.synmarkDisplay.marked === true){
                //make another call to add it to playlist
                var pliid = $routeParams.pliid;
                $scope.synmarkPromise = synmarkService.addToPlaylistItem(result.synmark, pliid)
                  .then(function (resultAddToPlaylist) {
                    //remove it from $scope.synmarks
                    result.synmark.marked = true;
                    $scope.refreshSynmarkDisplay();
                    $scope.showToaster("success","success",$translate('ADD_SYNMARK_TO_PLAYLIST_SUCCESS_TEXT'), 3000);
                  }, function (error) {
                    $scope.showToaster("error","error",error, 3000);
                    //do nothing
                  });
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
      };

      $scope.shouldSynmarkHighlighted = function(synmark){
        var ct = $scope.API.currentTime.getTime()/1000;
        if(synmark.mfst<ct && synmark.mfet>ct){
          return true;
        }
        else{
          return false;
        }
      };

      /*synmark functions end*/

      /*transcript functions start */
      $scope.canCreateTranscript = function(){ //whether this user can create transcript or not
        return true;
      };

      $scope.canCreateCue = function(){ //whether this user can create cue or not
        return (typeof $scope.selectedTranscript !== "undefined");
      };

      $scope.canEditCue = function(cue){
        return true; //currently, everyone can edit
      }

      $scope.changeSelectedTranscript = function(transcript){ //change selected language
        $scope.selectedTranscript = transcript;
        return;
      };

      //get whether the cue should be highlighted, if yes, set the $scope.currentCue
      $scope.shouldCueHighlighted = function(cue){
        var ct = $scope.API.currentTime.getTime(); //it's milliseconds in cue
        if(cue.st<ct && cue.et>ct){
          $scope.currentCue = cue;
          return true;
        }
        else{
          //$scope.currentCue = null;
          return false;
        }
      };

      $scope.playCue = function(cue){
        var st = cue.st;
        $scope.API.seekTime(st/1000,false);
        var videoDiv = angular.element(document.getElementById('video_div'));
        $document.scrollToElementAnimated(videoDiv);
        return;
      };

      $scope.editCue = function(cue,$event){
        $event.stopPropagation(); //stop the cue click event to propagate to the whole cue div
        $scope.showEditingCueForm = true;
        $scope.API.pause();//stop the video
        var videoDiv = angular.element(document.getElementById('video_div'));
        $document.scrollToElementAnimated(videoDiv); //score to the correct page position

        //let currentEditingSynmark reference to the current synmark
        //Every change to the currentEditingSynmark will will also change the synmark in $scope.synmarks list
        $scope.currentEditingCue = cue;
        $scope.currentEditingCue.ststr = $scope.secondsToHHMMSS(cue.st/1000);
        $scope.currentEditingCue.etstr = $scope.secondsToHHMMSS(cue.et/1000);
      }

      $scope.showTranscriptForm = function(){
        if(!$scope.showEditingTranscriptForm){ //if not shown at the moment, it's not editing synmark, so we need to create a new synmark
          $scope.showEditingTranscriptForm = true;
        }
        $scope.transcriptObj.lang="";
      };

      $scope.cancelTranscriptEditing = function(){
        $scope.showEditingTranscriptForm = false;
        $scope.transcriptObj.lang = "";
      };

      $scope.processTranscriptForm = function(){
        var newTranscript = new Transcript();
        newTranscript.lang = $scope.transcriptObj.lang;
        //TODO: check whether the language has been created yet
        newTranscript.annotates = $scope.multimedia.id;
        newTranscript.owner = $scope.multimedia.owner.id;
        newTranscript.rsid = Math.random().toString(36).slice(2); //generate random string

        $scope.transcriptPromise = Transcript.save(newTranscript).$promise
          .then(function (newtrans) {
            $scope.transcriptObj.lang = "";
            if(typeof $scope.transcripts === "undefined"){
              $scope.transcripts = [];
            }
            $scope.transcripts.push(newtrans);
            $scope.selectedTranscript=newtrans;
            $scope.showToaster("success","success",$translate('CREATE_TRANSCRIPT_SUCCESS_TEXT'), 3000);
            $scope.showEditingTranscriptForm = false;

          }, function (error) {
            $scope.showToaster("error","error",error, 3000);
          });
      }

      $scope.showCueForm = function(){
        if(!$scope.showEditingCueForm){ //if not shown at the moment, it's not editing synmark, so we need to create a new synmark
          $scope.showEditingCueForm = true;
          $scope.currentEditingCue = {}
        }

        $scope.currentEditingCue.ststr = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
        $scope.currentEditingCue.etstr = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
        $scope.API.pause();
      };

      $scope.cancelCueEditing = function(){
        $scope.showEditingCueForm = false;
        $scope.currentEditingCue=null;
      };

      $scope.setCueSt = function(){
        $scope.currentEditingCue.ststr = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
      };

      $scope.setCueEt = function(){
        $scope.currentEditingCue.etstr = $scope.secondsToHHMMSS($scope.API.currentTime.getTime()/1000);
      };

      $scope.processCueForm = function(){
        var st = utilService.HHMMSSToSeconds($scope.currentEditingCue.ststr);
        if(isNaN(st)){
          $scope.showToaster("error","error",$translate('CUE_ST_ERROR'), 3000);
        }
        var et = utilService.HHMMSSToSeconds($scope.currentEditingCue.etstr);
        if(isNaN(et)){
          $scope.showToaster("error","error",$translate('CUE_ET_ERROR'), 3000);
        }

        var submittedCue = new Cue();
        submittedCue.belongsTo = $scope.selectedTranscript.id;
        submittedCue.st = st*1000;
        submittedCue.et = et*1000;
        submittedCue.content = $scope.currentEditingCue.content;
        submittedCue.rsid = $scope.currentEditingCue.rsid?$scope.currentEditingCue.rsid:Math.random().toString(36).slice(2); //generate random string if doesn't exists
        submittedCue.owner = authenticationService.getUserInfo().id;

        if($scope.currentEditingCue.id){ //edit
          submittedCue.id = $scope.currentEditingCue.id;
          $scope.cuePromise = Cue.update(submittedCue).$promise
            .then(function (newCue) {
              $scope.currentEditingCue = newCue;
              $scope.currentEditingCue.ststr = utilService.secondsToHHMMSS(newCue.st/1000);
              $scope.currentEditingCue.etstr = utilService.secondsToHHMMSS(newCue.et/1000);
              $scope.showToaster("success","success",$translate('SAVE_CUE_SUCCESS_TEXT'), 3000);
              $scope.cancelCueEditing();
            }, function (error) {
              $scope.showToaster("error","error",error, 3000);
              //do nothing
            });
        }
        else{//create new one
          $scope.cuePromise = Cue.save(submittedCue).$promise
            .then(function (newCue) {
              if(!$scope.selectedTranscript.cues)
                $scope.selectedTranscript.cues = [];
              $scope.selectedTranscript.cues.push(newCue);
              $scope.showToaster("success","success",$translate('SAVE_CUE_SUCCESS_TEXT'), 3000);
              $scope.cancelCueEditing();

            }, function (error) {
              $scope.showToaster("error","error",error, 3000);
              //do nothing
            });
        }
      }

      /*transcript functions end */


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
        setTimeout(function(){
          var tagsinput = angular.element(document.getElementsByClassName("tagsinput"));
          tagsinput.tagsinput();
        },2000);

        $scope.loadPromise = multimediaService.getMultimedia(mmid, pliid)
          .then(function (data) {
            //console.log(data);
            $scope.multimedia = data.multimedia;
            $scope.synmarks = data.synmarks;
            $scope.transcripts = data.transcripts;
            if($scope.transcripts)
              $scope.selectedTranscript = $scope.transcripts[0];//default, change it later

            if(data.playlistItem){
              $scope.hidePlaylist = false;
              //$scope.synmarkDisplay.marked = false;

              $scope.playlist = data.playlistItem.playlist;
            }

            $scope.refreshSynmarkDisplay();
            if($scope.synmarkDisplay.chained){ //if the chained is selected when page load, we need to create the cuepoints and start playing from cuepoints
              $scope.toggleChained();
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

                var videoSources = [];

                if(data.multimedia.url.indexOf("//res.cloudinary.com/")!== -1){//the video is from cloudinary, which has 3 different formats
                  //TODO: add a programme to auto select video if we have more formats for different devices
                  videoSources = utilService.getCloudinaryCompitableVideoSource(data.multimedia.url);
                }
                else{
                  videoSources.push({url:data.multimedia.url, type:type});
                }

                var videogularSources = videoSources.map(function(source){
                  return {src: $sce.trustAsResourceUrl(source.url), type:source.type};
                });

                console.log(videogularSources);
                $scope.videos = [{
                  sources: videogularSources
                }];
              }

              $scope.config = {
                autoHide: true,
                autoPlay: true,
                loop: false,
                preload: "auto",
                transclude: true,
                sources:$scope.videos[0].sources
                //theme: ENV.name==='development'?'bower_components/videogular-themes-default/videogular.css':'styles/vendor.css'
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

              if($scope.playlist && pl.id === $scope.playlist.playlist.id){ //refresh the current playlist because the video is added to the current playlist
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
