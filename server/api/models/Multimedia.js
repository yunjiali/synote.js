/**
* Multimedia.js
*
* @description :: Multimedia resource
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var randomstring = require("randomstring");

module.exports = {

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
      url:"true",
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
      url:"true",
      size:"4096"
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
    }
  },

  beforeCreate:function(values,cb){
    values.rsid = randomstring.generate();
  }

  //TODO: delete multimedia then also delete PlaylistItem
};

