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
    'LocalStorageModule',
    'ui.bootstrap'
    //leave ui-route for synoteplayer
  ]);
//app config
app.config(['$routeProvider', 'localStorageServiceProvider', '$httpProvider', function ($routeProvider ,localStorageServiceProvider,$httpProvider) {
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
    .when('/multimedia.create', {
      templateUrl: 'views/multimedia.create.html',
      controller: 'MultimediaCreateCtrl',
      resolve:{
        loginRequired: function(policyService){
          return policyService.loginRequired();
        }
      }
    })
    .when('/watch',{
      templateUrl: 'views/login.html',
      controller: 'WatchCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  localStorageServiceProvider
    .setPrefix('synoteClient');

  $httpProvider.defaults.withCredentials = true;
}]);

app.run(['$rootScope', '$location', function ($rootScope, $location) {

  /*$rootScope.$on('$locationChangeStart', function(evt, next, current, authenticationService){
    var nextPath = $location.path();
    var nextRoute = $route.routes[nextPath]

    if(nextRoute.auth && nextRoute.auth && !authenticationService.isLoggedIn()){
      $location.path("/login");
      // event.preventDefault();
    }
  });*/
  $rootScope.$on('$routeChangeSuccess', function (userInfo) {
    //console.log(userInfo);
  });
  /*
  $rootScope.$on('$routeChangeError', function (event, current, previous, eventObj) {
    if (eventObj.authenticated === false) {
      $location.path('/login');
    }
  });*/
}]);
