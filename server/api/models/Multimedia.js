/**
* Multimedia.js
*
* @description :: Multimedia resource
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var si=require('search-index');

module.exports = {
  types:{
    customurl:function(url){
      return require('validator').isURL(url);
    }
  },
  attributes: {
    title:{
      type:'string',
      size:'1024',
      required:true
    },
    description:{
      type:'text'
    },
    owner:{
      model:'user'
    },
    publicPermission:{
      //'public','comment','edit', 'private'
      type:"string",
      enum:['private','view','comment','edit'],
      required:true,
      defaultsTo:"comment" //could be admin, normal
    },
    url:{
      type:"string",
      customurl:true,
      size:"4096"
    },
    tags:{
      collection:'tag',
      via:'ownermm'
    },
    duration:{
      type:'integer',
      defaultsTo:0
    },
    starttime:{ //the realworld start time
      type:'datetime'
    },
    rsid:{ //random string id
      type:'string',
      unique:true,
      required:true,
      index:true
    },
    mtype:{
      //'video','audio', something else?
      type:"string",
      enum:['video','audio'],
      required:true,
      defaultsTo:"video"
    },
    thumbnail:{
      type:"string",
      customurl:true,
      size:"4096",
      defaultsTo:"http://res.cloudinary.com/symbolnet/image/upload/v1417996309/default_wlvnze.jpg"
    },
    synmarks:{
      collection:'synmark',
      via:'annotates'
    },
    transcripts:{
      collection:'transcript',
      via:'annotates'
    },
    slides:{
      collection:'slide',
      via:'annotates'
    },
    playlists:{
      collection:'playlistItem',
      via:'multimedia'
    },
    getIndexObj:function(){
      return {
        title: this.title,
        description: this.description,
        id: this.rsid,
        publicPermission: this.publicPermission,
        tags: this.tags.map(function (tag) {
          return tag.content;
        })
      }
    }
  },
  //TODO: delete multimedia then also delete PlaylistItem
  //TODO: delete multimedia then also delete synmarks, transcripts and slides
  afterCreate:function(createdmm, cb){

    if(sails.config.index.enabled) {

      Multimedia.findOne({id: createdmm.id}).populate('tags').then(
          function (newmm) {
            var mmIndex = newmm.getIndexObj();
            si.add({'batchName': 'multimedia', 'filters': ['title', 'description', 'tags','publicPermission']}, [mmIndex], function (err) {
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

  afterUpdate:function(updatedmm, cb){

    if(sails.config.index.enabled) {
      Multimedia.findOne({id: updatedmm.id}).populate('tags').then(
          function (newmm) {
            var mmIndex = newmm.getIndexObj();

            si.add({'batchName': 'multimedia', 'filters': ['title', 'description', 'tags']}, [mmIndex], function (err) {
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
  afterDestroy: function(deleted_mm, next){
    //remove index
    if(sails.config.index.enabled) {
      si.del(deleted_mm.rsid, function (err) {
        //do nothing
        next();
      });
    }
    else{
      next();
    }


  }
};

