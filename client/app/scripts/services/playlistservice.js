'use strict';

/**
 * @ngdoc service
 * @name synoteClientApp.playlistService
 * @description
 * # playlistService
 * Service in the synoteClientApp.
 */
angular.module('synoteClient')
  .service('playlistService', ["$http","$q", 'ENV', 'authenticationService', function ($http, $q, ENV, authenticationService) {
    var currentPlaylists = [];

    function get(plid){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;
      var accessTokenStr = accessToken?("?access_token="+accessToken):"";

      $http.get(ENV.apiEndpoint + "/playlist/get/"+plid+accessTokenStr)
        .then(function (result) {
          if(result.status === 200) {
            deferred.resolve(result.data);
          }
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function list(){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;
      var accessTokenStr = accessToken?("?access_token="+accessToken):"";

      $http.get(ENV.apiEndpoint + "/playlist/list"+accessTokenStr)
        .then(function (result) {
          if(result.status === 200) {
            currentPlaylists = result.data;
            deferred.resolve(result.data);
          }
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function create(metadata) {

      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.post(ENV.apiEndpoint + "/playlist/create?access_token="+accessToken, metadata)
        .then(function (result) {

          var data = result.data;
          //if success
          //console.log(data);
          if(data.success === false){
            deferred.reject(result.data);
          }
          else {
            //$location.path('/login');
            deferred.resolve(result.data);
          }
        }, function (err) {
          deferred.reject(err);
        });

      return deferred.promise;

    }

    function getCurrentPlaylists(){
      return currentPlaylists;
    }

    function additem(plid,mmid){
      //'/playlist/'+plid1+'/add/'+mmid1+'?access_token='+accessToken
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.post(ENV.apiEndpoint + '/playlist/'+plid+'/add/'+mmid+'?access_token='+accessToken, {})
        .then(function (result) {

          var data = result.data;
          //if success
          //console.log(data);
          if(data.success === false){
            deferred.reject(result.data);
          }
          else {
            //$location.path('/login');
            deferred.resolve(result.data);
          }
        }, function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function savePlaylistItems(items,plid){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      var cleanedItems = items.map(function(item,index){
        return {id:item.id, ind:item.ind, rsid:item.rsid}
      });

      $http.post(ENV.apiEndpoint + '/playlist/'+plid+'/save?access_token='+accessToken, cleanedItems)
        .then(function (result) {

          var data = result.data;
          //if success
          //console.log(data);
          if(data.success === false){
            deferred.reject(result.data);
          }
          else {
            //$location.path('/login');
            deferred.resolve(result.data);
          }
        }, function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    return {
      get:get,
      list:list,
      create:create,
      getCurrentPlaylists: getCurrentPlaylists,
      additem:additem,
      savePlaylistItems:savePlaylistItems
    }
  }]);
