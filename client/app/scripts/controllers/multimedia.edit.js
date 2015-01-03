'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:MultimediaEditCtrl
 * @description
 * # MultimediaEditCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('MultimediaEditCtrl', ["$scope","$filter","$location","$routeParams", "multimediaService", "utilService",'messageCenterService','authenticationService',
    function ($scope,$filter, $location, $routeParams, multimediaService,utilService,messageCenterService,authenticationService) {
      var $translate = $filter('translate');
      $scope.metadata = {};
      $scope.durationStr = "";
      $scope.createdat=""
      var tagsStr = "";

      var mmid = $routeParams.mmid;
      if(!mmid){
        $location.path('/');
      }

      $('.tagsinput').tagsinput();

      multimediaService.getMultimedia(mmid).then(function(mm){
        //title, description, url, duration,starttime,thumbnail,id (hidden), createdAt, tags
        //TODO:starttime is missing here
        $scope.metadata.id = mm.multimedia.id;
        $scope.metadata.title = mm.multimedia.title;
        $scope.metadata.description = mm.multimedia.description;
        $scope.metadata.url = mm.multimedia.url;
        $scope.metadata.thumbnail = mm.multimedia.thumbnail;
        $scope.metadata.duration = mm.multimedia.duration;
        $scope.createdat =  mm.multimedia.createdAt;

        var tagsStr = mm.multimedia.tags.map(function(tag){
          $('.tagsinput').tagsinput('add',tag.text);
          return tag.text;
        }).toString();
        $scope.metadata.tags = tagsStr;
        $scope.durationStr = utilService.secondsToHHMMSS($scope.metadata.duration);
      },function(err){
        $location.path('/');
        messageCenterService.add('danger',$translate('MMID_INVALID_TEXT'),{timeout:5000});
      });


      $scope.processForm = function(){
        console.log("processForm");
        messageCenterService.reset();

        $scope.metadata.tags = $scope.tagsStr;

        //if($scope)
        $scope.editPromise = multimediaService.saveMultimedia($scope.metadata)
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
