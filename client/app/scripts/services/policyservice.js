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

    var redirectIfAuthenticated = function(route){
      var deferred = $q.defer();

      if (authenticationService.isLoggedIn()) {
        deferred.reject({ authenticated: false })
        $location.path(route);
      } else {
        deferred.resolve()
      }

      return deferred.promise;
    }

    // Public API here
    return {
      loginRequired: loginRequired,
      redirectIfAuthenticated: redirectIfAuthenticated
    };
  }]);
