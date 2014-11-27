/**
* Synmark.js
*
* @description :: Synmark
* @docs        :: http://sailsjs.org/#!documentation/models
*/

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
    }
  },
  getMediaFragmentString:function(){ // return a valid media fragment string

  }

  //TODO: implement customised validator for synmark: one of the title, content, tags must present
  //TODO: implement validation that mfet must bigger than mfst
  //TODO: delete synmark also delete the synmark in any playlist
};

