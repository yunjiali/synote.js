'use strict';

/**
 * @ngdoc service
 * @name synoteClient.multimediaService
 * @description
 * # multimediaService
 * Factory in the synoteClient.
 */
angular.module('synoteClient')
  .factory('multimediaService', ["$http","$q", 'ENV', 'authenticationService',
      function ($http, $q, ENV, authenticationService, messageCenterService) {

    function getMetadata(url, subtitles) {
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.get(ENV.apiEndpoint + "/multimedia/metadata?access_token="+accessToken+"&url="+encodeURI(url)+(subtitles?"&subtitles=true":""))
        .then(function (result) {
          if(result.status === 200)
            deferred.resolve(result.data);
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject();
        });

      return deferred.promise;
    }

    function getMultimedia(mmid, plid){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;
      var accessTokenStr = accessToken?("access_token="+accessToken):"";
      var plidStr = plid?("plid="+plid):"";
      if(accessToken && plid)
        plidStr = "&"+plidStr


      $http.get(ENV.apiEndpoint + "/multimedia/get/"+mmid+"?"+accessTokenStr+plidStr)
        .then(function (result) {
          if(result.status === 200)
            deferred.resolve(result.data);
          else
            deferred.reject({success:false,message:result.statusText});
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function createMultimedia(metadata){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.post(ENV.apiEndpoint + "/multimedia/create?access_token="+accessToken, metadata)
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

    function saveMultimedia(metadata){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.post(ENV.apiEndpoint + "/multimedia/save/"+metadata.id+"?access_token="+accessToken, metadata)
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

    function listMultimedia(skip, limit, sortby, order){
      var deferred = $q.defer();

      var queryStr = "?";
      //use != undefined to cover both "undefined" and "null"
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

      console.log(queryStr);
      $http.get(ENV.apiEndpoint + "/multimedia/list"+queryStr)
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

    function listMultimediaByOwner(skip, limit, sortby, order){
      var deferred = $q.defer();

      var accessToken = authenticationService.getUserInfo().accessToken;

      $http.get(ENV.apiEndpoint + "/multimedia/listByOwner")
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
      getMetadata: getMetadata,
      getMultimedia: getMultimedia,
      createMultimedia:createMultimedia,
      saveMultimedia:saveMultimedia,
      listMultimedia:listMultimedia,
      listMultimediaByOwner:listMultimediaByOwner
    };

  }]);
