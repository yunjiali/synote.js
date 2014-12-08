'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('RegisterCtrl', ['$scope', '$http','$filter', '$location', 'ENV', 'messageCenterService','utilService',
      function ($scope,$http,$filter, $location, ENV, messageCenterService, utilService) {
    $scope.t_c = false;
    $scope.confirmpassword;
    $scope.formdata = {};
    var $translate = $filter('translate');

    $scope.processForm = function () {
      //clean alerts
      //check terms and conditions
      if(!$scope.t_c) {
        messageCenterService.add('danger',$translate('TC_ERR'));
        return;
      }

      if($scope.formdata.password !==  $scope.confirmpassword){
        messageCenterService.add('danger',$translate('PASSWORD_REG_NOTMATCH'));
        return;
      }
      //check password
      $http.post(ENV.apiEndpoint + "/user/create", $scope.formdata)
        .then(function (result) {
          //console.log(data);
          //if unsuccess, push alerts
          var data = result.data;
          //if success
          //console.log(data);
          if(data.success === false){
            var msgs = utilService.extractErrorMsgs(data.message);
            for(var i=0;i<msgs.length;i++){
              messageCenterService.add('danger', msgs[i]);
            }
          }
          else {
            messageCenterService.add('success', $translate('You have been successfully registered.'));
            //$location.path('/login');
          }
        }, function (err) {
          messageCenterService.add('danger',err);
        });
    }

  }]);
