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
    'cgBusy',
    'config',
    'LocalStorageModule',
    'ui.bootstrap',
    'angularMoment',
    'xeditable',
    'MessageCenterModule',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    "info.vietnamcode.nampnq.videogular.plugins.youtube"
    //leave ui-route for synoteplayer
  ]);
//app config
app.config(['$routeProvider', 'localStorageServiceProvider', '$httpProvider', '$translateProvider',
    function ($routeProvider ,localStorageServiceProvider,$httpProvider,$translateProvider) {
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
      controller: 'LoginCtrl',
      resolve:{
        notLoggedIn:function(policyService){
          return policyService.notLoggedIn();
        }
      }
    })
    .when('/register',{
      templateUrl:'views/register.html',
      controller:'RegisterCtrl'
    })
    .when('/user/:userId',{
      templateUrl:'views/user.html',
      controller:'UserCtrl',
      resolve:{
        isSameUser: function(policyService, $route){
          return policyService.isSameUser($route.current.params.userId);
        }
      }
    })
    .when('/user/:userId/multimedia/list',{
      templateUrl:'views/user.multimedia.list.html',
      controller:'UserMultimediaListCtrl',
      resolve:{
        isSameUser: function(policyService, $route){
          return policyService.isSameUser($route.current.params.userId);
        }
      }
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
    .when('/multimedia.edit/:mmid', {
      templateUrl: 'views/multimedia.edit.html',
      controller: 'MultimediaEditCtrl',
      resolve:{
        loginRequired: function(policyService){
          return policyService.loginRequired();
        }
      }
    })
    .when('/browse',{
      templateUrl:'views/browse.html',
      controller:'BrowseCtrl'
    })
    .when('/playlist.create',{
      templateUrl: 'views/playlist.create.html',
      controller: 'PlaylistCreateCtrl',
      resolve:{
        loginRequired: function(policyService){
          return policyService.loginRequired();
        }
      }
    })
    .when('/playlist.edit/:playlistId',{
      templateUrl: 'views/playlist.edit.html',
      controller: 'PlaylistEditCtrl',
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
    EDIT_TEXT:'Edit',
    SAVE_TEXT:'Save',
    CANCEL_TEXT:'Cancel',
    TC_ERR:'You must agree on our terms and conditions.',
    PASSWORD_REG_NOTMATCH:"Password and confirmed password don't match.",
    CREATE_NAV_LINK:"Create",
    PROFILE_NAV_LINK:"Profile",
    REG_NAV_LINK:"Register",
    REG_SUBMIT_BTN:"Register",
    REG_RESET_BTN:"Reset",
    REG_SUCCESS_TEXT:"You have been successfully registered.",
    CREDENTIAL_ERR_TEXT:'Wrong username or password.',
    LOGOUT_NAV_LINK:'Log out',
    LOGOUT_SUCCESS_TEXT:'You have successfully logged out.',
    LOGOUT_ERR_TEXT:'Sorry, something went wrong. Please try again later.',
    NOSUBTITLE_TEXT:'No Subtitle available',
    LOGIN_REQUIRED_TEXT:'Login Required.',
    CREATE_MM_SUCCESS_TEXT:'The multimedia asset has been created.',
    LOST_SERVER_CONNECTION_TEXT:'Cannot connect to server. Please try again later.',
    NO_PLAYLIST_TEXT:'No playlist',
    FAILED_LOADING_PLAYLIST_TEXT:'Loading playlist error.',
    PLAYLIST_TITLE_PH_TEXT:'Playlist Title',
    PLAYLIST_TITLE_ERR_TEXT:'Playlist title is missing',
    PLAYLIST_DESCRIPTION_PH_TEXT:'Playlist description',
    PLAYLIST_DESCRIPTION_ERR_TEXT:'Playlist description is missing',
    CREATE_PLAYLIST_SUCCESS_TEXT:'Playlist has been successfully created',
    PLAYLIST_NOVIDEO_TEXT:'No multimedia resource in this playlist.',
    MMID_INVALID_TEXT:'Cannot find the multimedia resource.',
    MULTIMEDIA_NOVIDEO_TEXT:'No multimedia resource is found.'
  });

  $translateProvider.determinePreferredLanguage(function () {
    // define a function to determine the language
    // and return a language key
    return 'en';
  });

  localStorageServiceProvider
    .setPrefix('synoteClient');

  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push('synoteHTTPInterceptor');
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
