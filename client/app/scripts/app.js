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
    'pascalprecht.translate',
    'ngTouch',
    'config',
    'LocalStorageModule',
    'ui.bootstrap',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    "info.vietnamcode.nampnq.videogular.plugins.youtube"
    //leave ui-route for synoteplayer
  ]);
//app config
app.config(['$routeProvider', 'localStorageServiceProvider', '$httpProvider', '$translateProvider', function ($routeProvider ,localStorageServiceProvider,$httpProvider,$translateProvider) {
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
    .when('/register',{
      templateUrl:'views/register.html',
      controller:'RegisterCtrl'
    })
    .when('/termsandconditions',{
      templateUrl:'views/termsandconditions.html'
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
    .when('/watch/:mmid/:plid?',{
      templateUrl: 'views/watch.html',
      controller: 'WatchCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  $translateProvider.translations('en',{
    LOGIN_NAV_LINK:'Login',
    HOME_NAV_LINK:'Home',
    BROWSE_NAV_LINK:'Browse',
    TC_ERR:'You must agree on our terms and conditions.',
    PASSWORD_REG_NOTMATCH:"Password and Confirmed password don't match.",
    CREATE_NAV_LINK:"Create",
    REG_NAV_LINK:"Register",
    REG_SUBMIT_BTN:"Register",
    REG_RESET_BTN:"Reset",
    REG_SUCCESS_TEXT:"You have been successfully registered.",
    CREDENTIAL_ERR_TEXT:'Wrong username or password.'
  });

  $translateProvider.determinePreferredLanguage(function () {
    // define a function to determine the language
    // and return a language key
    return 'en';
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
