'use strict';

/**
 * @ngdoc service
 * @name synoteClientApp.policyService
 * @description Policies used to access controllers
 * # policyService
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('policyService', ['$location', '$q', 'authenticationService', function ($location, $q, authenticationService) {

    //require user login
    var loginRequired = function(){
      var deferred = $q.defer();

      if(!authenticationService.isLoggedIn()) {
          deferred.reject({ authenticated: false })
          $location.path('/login');
      } else {
          deferred.resolve()
      }

      return deferred.promise;
    }

    //user not logged in
    var notLoggedIn = function(){
      var deferred = $q.defer();

      if(!authenticationService.isLoggedIn()){
        deferred.resolve();
      }
      else{
        deferred.reject({authenticated: true })
        $location.path('/');
      }
    }

    var redirectIfAuthenticated = function(route){
      var deferred = $q.defer();

      if (authenticationService.isLoggedIn()) {
        deferred.reject({ authenticated: false });
        $location.path(route);
      } else {
        deferred.resolve()
      }

      return deferred.promise;
    }

    var isSameUser = function(userId){
      var deferred = $q.defer();
      var userInfo = authenticationService.getUserInfo();
      if(!userInfo) {
        deferred.reject({authenticated: false});
        $location.path('/');
      }

      if(userInfo.id !== parseInt(userId)) {
        deferred.reject({isSameUser: false});
        $location.path('/');
      }
      else
        deferred.resolve();

      return deferred.promise;
    }

    // Public API here
    return {
      loginRequired: loginRequired,
      notLoggedIn:notLoggedIn,
      isSameUser: isSameUser,
      redirectIfAuthenticated: redirectIfAuthenticated
    };
  }]);
