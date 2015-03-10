'use strict';

/**
 * @ngdoc service
 * @name synoteClientApp.CueService
 * @description
 * # Cue this is a resource service for cue
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('Cue', ['$resource', 'ENV', function ($resource,ENV) {
    return $resource(ENV.apiEndpoint+'/cue/:id',{id:'@id'},{
      update: {
        method: 'PUT' // this method issues a PUT request
      }
    });
  }]);
