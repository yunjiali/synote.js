'use strict';

/**
 * @ngdoc service
 * @name synoteClientApp.synmarkservice
 * @description
 * # synmarkservice
 * Service in the synoteClient.
 */
angular.module('synoteClient')
  .service('synmarkService', ["$http","$q", 'ENV', 'authenticationService', function ($http, $q, ENV, authenticationService, messageCenterService) {
    function createSynmark(synmark){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.post(ENV.apiEndpoint + "/synmark/create?access_token="+accessToken, synmark)
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

    function deleteSynmark(synmark){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.delete(ENV.apiEndpoint + "/synmark/delete/"+synmark.id+"?access_token="+accessToken)
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

    function saveSynmark(synmark){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.post(ENV.apiEndpoint + "/synmark/save/"+synmark.id+"?access_token="+accessToken, synmark)
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

    function addToPlaylistItem(synmark, pliid){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;


      $http.post(ENV.apiEndpoint + '/playlistitemsynmark/'+pliid+'/add/synmark/'+synmark.id+'?access_token='+accessToken)
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

    function removeFromPlaylistItem(synmark, pliid){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;


      $http.delete(ENV.apiEndpoint + '/playlistitemsynmark/'+pliid+'/remove/synmark/'+synmark.id+'?access_token='+accessToken)
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

    function listSynmarkByOwner(query,skip,limit,sortby,order ){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      var queryStr = "?access_token="+accessToken+"&";
      //use != undefined to cover both "undefined" and "null"
      if(query !== undefined){
        queryStr += "q="+encodeURIComponent(query);
        queryStr+="&";
      }

      if(skip != undefined){
        queryStr += "skip="+skip;
      }
      else{
        queryStr +="skip=0";
      }

      queryStr+="&";
      if(limit != undefined){
        queryStr += "limit="+limit;
      }
      else{
        queryStr += "limit=10";
      }

      queryStr+="&";
      if(sortby != undefined) {
        queryStr += "sortby=" + sortby;
      }
      else{
        queryStr += "sortby=createdAt";
      }

      queryStr+="&";
      if(order === "ASC"){
        queryStr+="order=ASC";
      }
      else{
        queryStr+="order=DESC";
      }

      $http.get(ENV.apiEndpoint + '/synmark/list/owner'+queryStr)
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
      createSynmark:createSynmark,
      deleteSynmark:deleteSynmark,
      saveSynmark:saveSynmark,
      addToPlaylistItem:addToPlaylistItem,
      removeFromPlaylistItem:removeFromPlaylistItem,
      listSynmarkByOwner:listSynmarkByOwner
    }
  }]);
