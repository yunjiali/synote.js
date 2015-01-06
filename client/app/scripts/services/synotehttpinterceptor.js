'use strict';

/**
 * @ngdoc service
 * @name synoteClientApp.synoteHTTPInterceptor
 * @description
 * # synoteHTTPInterceptor
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('synoteHTTPInterceptor', ['$q', '$rootScope', '$location', '$filter','messageCenterService',
      function ($q, $rootScope, $location, $filter, messageCenterService) {
    //handle error messages
    //handle policy problem
    var $translate = $filter('translate');
    return {
      request:function(config){

        return config;
      },

      response: function (response) {
        // do something on success
        //console.log('success');
        //console.log('status', response.status);
        //return response;
        return response || $q.when(response);
      },

      responseError: function (response) {
        // do something on error

        //console.log('failure');
        //console.log('status', response.status)
        //return response;
        console.log(response);
        if(response.status === 0 || response.status === 503){
          messageCenterService.add('danger', $translate('LOST_SERVER_CONNECTION_TEXT'));
          $location.path('/503');
        }
        else if(response.status === 400){
          messageCenterService.add('danger', response.data);
        }
        else if(response.status === 403)
        {
          messageCenterService.add('danger', $translate('LOGIN_REQUIRED_TEXT'));
          $location.path('/login');
        }
        return $q.reject(response);
      }
    }
  }]);
