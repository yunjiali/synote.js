'use strict';

/**
 * @ngdoc service
 * @name synoteClientApp.TagService
 * @description
 * # TagService
 * This is a angular resource for tag
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('tagService', [ '$q','$http','ENV','authenticationService', function ($q, $http, ENV, authenticationService) {
    function list(){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;
      var accessTokenStr = accessToken?("?access_token="+accessToken):"";

      $http.get(ENV.apiEndpoint + "/tag/list"+accessTokenStr)
        .then(function (result) {
          if(result.status === 200) {
            deferred.resolve(result.data);
          }
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    function listJQCloud(){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;
      var accessTokenStr = accessToken?("?access_token="+accessToken):"";

      $http.get(ENV.apiEndpoint + "/tag/list/jqloud"+accessTokenStr)
        .then(function (result) {
          if(result.status === 200) {
            deferred.resolve(result.data);
          }
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    function listSynmarkTagJQCloud(){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;
      var accessTokenStr = accessToken?("?access_token="+accessToken):"";

      $http.get(ENV.apiEndpoint + "/tag/list/synmark/jqcloud"+accessTokenStr)
        .then(function (result) {
          if(result.status === 200) {
            deferred.resolve(result.data);
          }
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    return {
      list:list,
      listJQCloud:listJQCloud,
      listSynmarkTagJQCloud:listSynmarkTagJQCloud
    }
  }]);
