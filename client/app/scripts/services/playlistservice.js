'use strict';

/**
 * @ngdoc service
 * @name synoteClientApp.playlistService
 * @description
 * # playlistService
 * Service in the synoteClientApp.
 */
angular.module('synoteClient')
  .service('playlistService', ["$http","$q", 'ENV', 'authenticationService', function ($http, $q, ENV, authenticationService) {
    function getPlaylist(plid){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;
      var accessTokenStr = accessToken?("?access_token="+accessToken):"";

      $http.get(ENV.apiEndpoint + "/playlist/get/"+plid+accessTokenStr)
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

    return {
      getPlaylist:getPlaylist
    }
  }]);
