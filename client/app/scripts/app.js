'use strict';

/**
 * @ngdoc overview
 * @name synoteClient
 * @description
 * # synoteClient
 *
 * Main module of the application.
 */
var app = angular
  .module('synoteClient', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'config',
    'LocalStorageModule'
  ]);
//app config
app.config(['$routeProvider', 'localStorageServiceProvider', function ($routeProvider, localStorageServiceProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      resolve: {
        auth: function ($q, authenticationService) {
          var userInfo = authenticationService.getUserInfo();
          if (userInfo) {
            return $q.when(userInfo);
          } else {
            return $q.reject({ authenticated: false });
          }
        }
      }
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  localStorageServiceProvider
    .setPrefix('synoteClient');
}]);

app.run(['$rootScope', '$location', function ($rootScope, $location) {

  //$rootScope.$on('$routeChangeSuccess', function (userInfo) {
    //console.log(userInfo);
  //});

  $rootScope.$on('$routeChangeError', function (event, current, previous, eventObj) {
    if (eventObj.authenticated === false) {
      $location.path('/login');
    }
  });
}]);
