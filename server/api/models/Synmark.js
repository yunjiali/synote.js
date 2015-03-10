/**
* Synmark.js
*
* @description :: Synmark
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var async = require('async');
var si=require('search-index');

module.exports = {

  attributes: {
    title:{
      type:'string',
      size:'1024'
    },
    content:{
      type:'text'
    },
    owner:{
      model:'user'
    },
    publicPermission:{
      type:"string",
      enum:['private','view','comment','edit'],
      required:true,
      defaultsTo:"comment" //can be commented
    },
    tags:{
      collection:'tag',
      via:'ownersynmark'
    },
    rsid:{ //random string id
      type:'string',
      unique:true,
      required:true,
      index:true
    },
    annotates:{
      model:'multimedia'
    },
    mfst:{ //media fragment start
      type:'integer',
      defaultsTo:0,
      min:0,
      required:true
    },
    mfet:{
      type:'integer',
      min:0 //TODO: should be bigger than mfst
    },
    timeformat:{ //time format
      type:"string",
      enum:['npt','smpte'],
      required:true,
      defaultsTo:"npt"
    },
    mfx:{
      type:'integer',
      min:0
    },
    mfy:{
      type:'integer',
      min:0
    },
    mfw:{
      type:'integer',
      min:0
    },
    mfh:{
      type:'integer',
      min:0
    },
    xywhunit:{//spatial dimension unit
      type:"string",
      enum:['pixel','percent'],
      required:true,
      defaultsTo:"percent"
    },
    comments:{
      collection:'comment',
      via:'belongsTo'
    },
    belongsToPlaylistItems:{
      collection:'PlaylistItemSynmark',
      via:'synmark'
    },
    getIndexObj:function(){
      return {
        title: this.title,
        content: this.content,
        id: this.rsid,
        publicPermission:this.publicPermission,
        tags: this.tags.map(function (tag) {
          return tag.content;
        })
      };
    }
  },
  getMediaFragmentString:function(){ // return a valid media fragment string

  },

  afterCreate:function(createdSyn, cb){
    if(sails.config.index.enabled) {
      Synmark.findOne({id: createdSyn.id}).populate('tags').then(
          function (newsynmark) {
            var synmarkIndex = newsynmark.getIndexObj();
            si.add({'batchName': 'synmark', 'filters': ['title', 'content', 'tags','publicPermission']}, [synmarkIndex], function (err) {
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

  afterUpdate:function(updatedSyn, cb){

    if(sails.config.index.enabled) {
      Synmark.findOne({id: updatedSyn.id}).populate('tags').then(
          function (newsynmark) {
            var synmarkIndex = newsynmark.getIndexObj();
            si.add({'batchName': 'synmark', 'filters': ['title', 'content', 'tags']}, [synmarkIndex], function (err) {
              //if(!err) console.log('indexed!');
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


  //TODO: implement customised validator for synmark: one of the title, content, tags must present
  //TODO: implement validation that mfet must bigger than mfst
  //TODO: delete synmark also delete the synmark in any playlist
  afterDestroy: function(deleted_synmarks, next){
    //remove index

    //remove tags
    async.eachSeries(deleted_synmarks, function(synmark, tagCallback){

      Tag.destroy({ownersynmark:synmark.id}).exec(function(err){
        if(err)
          tagCallback(err);
        tagCallback(null);
      })
    }, function(err){
      if(err)
        console.log(err);

      //remove playlistitemsynmark
      async.eachSeries(deleted_synmarks, function(synmark, itemCallback){

        PlaylistItemSynmark.destroy({synmark:synmark.id}).exec(function(err){
          if(err)
            itemCallback(err);
          itemCallback(null);
        })
      }, function(err){
        if(err)
          console.log(err);

        if(sails.config.index.enabled) {
          si.del(deleted_synmarks.rsid, function (err) {
            next();
          });
        }
        else {
          next();
        }
      });
    });
  }
};

