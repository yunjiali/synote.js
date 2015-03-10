/**
* Cue.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var si=require('search-index');

module.exports = {

  attributes: {
    belongsTo:{
      model:'transcript'
    },
    owner:{
      model:'user'
    },
    rsid: { //random string id
      type: 'string',
      unique: true,
      required: true,
      index: true
    },
    content:{
      type:'text'
    },
    st:{ //starttime in milliseconds
      type:'integer',
      defaultsTo:0,
      min:0,
      required:true
    },
    et:{ //endtime in milliseconds
      type:'integer',
      defaultsTo:0,
      min:0,
      required:true
    },
    ind:{ //cue index, but really don't think it is used here
      type:'integer',
      required:true,
      min:1,
      defaultsTo:1
    },
    settings:{ //used for WebVTT
      type:'string',
      size:'1024'
    },
    getIndexObj:function(){ //get the object to be indexed
      return {
        content: this.content,
        id: this.rsid
      }
    }
  },
  afterCreate:function(createdCue, cb){

    if(sails.config.index.enabled) {
      Cue.findOne({id: createdCue.id}).then(
          function (newcue) {
            var cueIndex = newcue.getIndexObj();
            si.add({'batchName': 'cue', 'filters': ['content']}, [cueIndex], function (err) {
              cb();
            });
          },
          function (err) {
            cb();
          }
      );
    }
    else {
      cb();
    }
  },

  afterUpdate:function(updatedCue, cb){

    if(sails.config.index.enabled) {
      Cue.findOne({id: updatedCue.id}).then(
          function (newcue) {
            var cueIndex = newcue.getIndexObj();
            si.add({'batchName': 'cue', 'filters': ['content']}, [cueIndex], function (err) {
              cb();
            });
          },
          function (err) {
            cb();
          }
      );
    }
    else {
      cb();
    }
  },
  afterDestroy: function(deleted_synmarks, next){
    //remove index
    if(sails.config.index.enabled) {
      si.del(deleted_cue.rsid, function (err) {
        next();
      });
    }
    else{
      next();
    }
  }
};

