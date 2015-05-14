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

    $scope.showCreationForm = false;
    $scope.metadata = {};
    $scope.url;
    $scope.thumbnail_url = null;
    $scope.durationStr = "";
    $scope.tagsStr = "";
    $scope.subtitles = [];

    $scope.getMetadata = function(){
      messageCenterService.reset();
      //http to get metadata
      $scope.inspectPromise = multimediaService.getMetadata($scope.url,true)
        .then(function (result) {
          $scope.metadata = result.metadata;
          if($scope.thumbnail_url != null){
            $scope.metadata.thumbnail = $scope.thumbnail_url;
          }
          if(result.subtitles) {
            $scope.subtitles = result.subtitles.list.map(function (subtitle) {
              return {language: subtitle.language, url: subtitle.url, selected: false}
            });
          }
          $scope.durationStr = utilService.secondsToHHMMSS($scope.metadata.duration);
          //console.log(result);
          $('.tagsinput').tagsinput();
          $scope.showCreationForm = true;
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
          $scope.allowChangeURL = true;
          //console.log(result);
          $location.path('/user/'+authenticationService.getUserInfo().id);
        }, function (error) {
          //console.log(error);
          messageCenterService.add('danger', error);
          //do nothing
        });
    }

    $scope.openCloudinary = function(){
      cloudinary.openUploadWidget({ cloud_name: 'symbolnettest', upload_preset: 'o0rvn2al', theme:'white',max_file_size:40000000, multiple:false, max_files:1},
        function(error, results) {
          if(error){
            messageCenterService.add('danger', error);
          }
          else if(results.length === 0){
            messageCenterService.add('danger', $translate('CREATE_MULTIMEDIA_VIDEO_UPLOADING_FAILED'));
          }
          else{
            /*
             Array[1]
             0: Object
             audio: Object
             bit_rate: 551193
             bytes: 383631
             created_at: "2015-05-13T07:57:15Z"
             duration: 5.533333
             etag: "a3ac7ddabb263c2d00b73e8177d15c8d"
             format: "mp4"
             frame_rate: 30
             height: 320
             path: "v1431503835/q1tgknavruskedibn3b8.mp4"
             public_id: "q1tgknavruskedibn3b8"
             resource_type: "video"
             rotation: 0
             secure_url: "https://res.cloudinary.com/symbolnettest/video/upload/v1431503835/q1tgknavruskedibn3b8.mp4"
             signature: "c268e8f298d40ae6506b7ff97e9902b8e3d16f4f"
             tags: Array[0]
             type: "upload"
             url: "http://res.cloudinary.com/symbolnettest/video/upload/v1431503835/q1tgknavruskedibn3b8.mp4"
             version: 1431503835
             video: Object
             width: 560
             */
            console.log(results);
            //the poster url
            //
            messageCenterService.add('success', $translate('CREATE_MULTIMEDIA_VIDEO_UPLOADING_SUCCESSFUL'));
            $scope.url = results[0].url;
            $scope.thumbnail_url=$scope.url.substr(0, $scope.url.lastIndexOf(".")) + ".jpg";
            $scope.getMetadata();
          }
        });
    }
  }]);
