'use strict';

/**
 * @ngdoc function
 * @name synoteClient.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('UserCtrl', ['$scope','ENV','authenticationService', 'messageCenterService', 'tagService',
      function ($scope, ENV, authenticationService, messageCenterService,tagService) {

        $scope.userInfo = authenticationService.getUserInfo();
        $scope.words = [];

        $scope.tagCloudPromise = tagService.listSynmarkTagJQCloud().then(
          function(data){
            $scope.words = data.words;
            for(var i=0;i<$scope.words.length;i++){

              $scope.words[i].link = "/#/user/"+$scope.userInfo.id+"/synmark/list?q="+encodeURIComponent(data.words[i].text);
            }

            console.log($scope.words);
          },
          function(err){
            //do nothing
          }
        );

  }]);
