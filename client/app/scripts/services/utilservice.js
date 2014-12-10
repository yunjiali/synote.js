'use strict';

/**
 * @ngdoc service
 * @name synoteClient.utilService
 * @description
 * # utilService
 * Factory in the synoteClient.
 * Some handy programmes to handle different problems
 */
angular.module('synoteClient')
  .factory('utilService', function () {
    var extractErrorMsgs = function(message){
      var messages = [];
      if(typeof message === 'string'){ //we customised the error message
        messages.push(data.message);
      }
      else if(typeof message === 'object'){
        for(var key in message.invalidAttributes){
          for(var i = 0; i<message.invalidAttributes[key].length;i++)
            messages.push(message.invalidAttributes[key][i].message);
        }
      }

      return messages;
    }

    var secondsToHHMMSS = function(totalSec){
      var hours = parseInt( totalSec / 3600,10 ) % 24;
      var minutes = parseInt( totalSec / 60,10 ) % 60;
      var seconds = parseInt(totalSec % 60,10);

      var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
      return result;
    }

    var HHMMSSToSeconds = function(hms){
      // your input string
      var a = hms.split(':'); // split it at the colons

      if(a.length !== 3)
        return NaN
      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
      return seconds;
    }

    return {
      extractErrorMsgs:extractErrorMsgs,
      secondsToHHMMSS:secondsToHHMMSS,
      HHMMSSToSeconds:HHMMSSToSeconds
    }
  });
