'use strict';

/**
 * @ngdoc service
 * @name synoteClient.flashservice
 * @description
 * # flashservice
 * Flash service to display messages across controllers
 */
angular.module('synoteClient')
  .factory('flashService', function ($rootScope) {
    var queue = [];
    var currentMessage = "";

    $rootScope.$on("$routeChangeSuccess", function() {
      currentMessage = queue.shift() || {};
    });

    return {
      setMessage: function(message,type) {
        queue.push({type:type,msg:message});
      },
      getMessage: function() {
        return currentMessage;
      }
    };
  });
