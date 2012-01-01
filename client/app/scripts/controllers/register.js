'use strict';

/**
 * @ngdoc function
 * @name synoteClientApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the synoteClient
 */
angular.module('synoteClient')
  .controller('RegisterCtrl', ['$scope', '$http','$filter', '$location', 'ENV', 'flashService', function ($scope,$http,$filter, $location, ENV, flashService) {
    $scope.t_c = false;
    $scope.confirmpassword;
    $scope.formdata = {};
    $scope.alerts = [];
    $scope.flash = flashService;
    var $translate = $filter('translate');

    $scope.processForm = function () {
      //clean alerts
      $scope.alerts = [];
      //check terms and conditions
      if(!$scope.t_c) {
        $scope.alerts.push({type: 'danger', msg: $translate('TC_ERR')});
        return;
      }

      if($scope.formdata.password !==  $scope.confirmpassword){
        $scope.alerts.push({type: 'danger', msg: $translate('PASSWORD_REG_NOTMATCH')});
        return;
      }
      //check password
      $http.post(ENV.apiEndpoint + "/user/create", $scope.formdata)
        .then(function (data) {
          console.log(data);
          //if unsuccess, push alerts
          //if success
          flash.setMessage({type:success, msg:$translate('REG_SUCCESS_TEXT')});
          $location.path('/login');
        }, function (err) {
          $scope.alerts.push({type: 'danger', msg: err});
        });
    }

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

  }]);
