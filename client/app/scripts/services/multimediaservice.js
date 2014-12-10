'use strict';

/**
 * @ngdoc service
 * @name synoteClient.multimediaService
 * @description
 * # multimediaService
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('multimediaService', ["$http","$q", 'ENV', 'authenticationService',
      function ($http, $q, ENV, authenticationService, messageCenterService) {

    function getMetadata(url, subtitles) {
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.get(ENV.apiEndpoint + "/multimedia/metadata?access_token="+accessToken+"&url="+encodeURI(url)+(subtitles?"&subtitles=true":""))
        .then(function (result) {
          if(result.status === 200)
            deferred.resolve(result.data);
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject();
        });

      return deferred.promise;
    }

    function getMultimedia(mmid, plid){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;
      var accessTokenStr = accessToken?("access_token="+accessToken):"";
      var plidStr = plid?("plid="+plid):"";
      if(accessToken && plid)
        plidStr = "&"+plidStr


      $http.get(ENV.apiEndpoint + "/multimedia/get/"+mmid+"?"+accessTokenStr+plidStr)
        .then(function (result) {
          if(result.status === 200)
            deferred.resolve(result.data);
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function createMultimedia(metadata){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.post(ENV.apiEndpoint + "/multimedia/create?access_token="+accessToken, metadata)
        .then(function (result) {

          var data = result.data;
          //if success
          //console.log(data);
          if(data.success === false){
            deferred.reject(result.data);
          }
          else {
            //$location.path('/login');
            deferred.resolve(result.data);
          }
        }, function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    return {
      getMetadata: getMetadata,
      getMultimedia: getMultimedia,
      createMultimedia:createMultimedia
    };

  }]);
