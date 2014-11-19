'use strict';

/**
 * @ngdoc service
 * @name synoteClient.authenticationService
 * @description
 * # authenticationService
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('authenticationService', ["$http","$q", 'ENV', 'localStorageService', function ($http, $q, ENV, localStorageService) {
    var userInfo;
    var accessToken;

    function login(email, password) {
      var deferred = $q.defer();

      $http.post(ENV.apiEndpoint+'/auth/login', { email: email, password: password, withCredentials: true})
        .then(function (result) {
          userInfo = {
            username: result.data.username
          };
          $http.get(ENV.apiEndpoint+'/user/jwt', {withCredentials: true})
            .then(function(tokenObj){
              accessToken = tokenObj.data.token;
              localStorageService.set('userInfo', userInfo);
              localStorageService.set('accessToken', accessToken);
              deferred.resolve(userInfo);
            }, function(tokenErr){
              deferred.reject(tokenErr);
          });
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();
      var accessToken = localStorageService.get('accessToken')

      $http({
        method: 'POST',
        url: ENV.apiEndpoint+'/auth/logout?access_token='+accessToken
      }).then(function (result) {
        userInfo = null;
        accessToken = null;
        localStorageService.set('userInfo', null);
        localStorageService.set('accessToken', null);
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function getUserInfo() {
      return userInfo;
    }

    function getAccessToken() {
      return accessToken;
    }

    function init() {
      if (localStorageService.get('userInfo')) {
        userInfo = localStorageService.get('userInfo');
      }

      if (localStorageService.get('accessToken')) {
        accessToken = localStorageService.get('accessToken');
      }
    }
    init();

    return {
      login: login,
      logout: logout,
      getUserInfo: getUserInfo,
      getAccessToken: getAccessToken
    };
  }]);
