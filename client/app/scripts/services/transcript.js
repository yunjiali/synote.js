'use strict';

/**
 * @ngdoc service
 * @name synoteClient.Transcript
 * @description
 * # Transcript this is a transcript resource service
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('Transcript', ['$resource', 'ENV', function ($resource, ENV) {
    return $resource(ENV.apiEndpoint+'/transcript/:id');
  }]);
