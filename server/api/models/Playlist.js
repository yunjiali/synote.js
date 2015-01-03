/**
* Playlist.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title:{
      type:'string',
      size:'1024',
      required:true
    },
    owner:{
      model:'user'
    },
    description:{
      type:'text'
    },
    rsid:{ //random string id
      type:'string',
      unique:true,
      required:true,
      index:true
    },
    publicPermission:{
      //'public','comment','edit', 'private'
      type:"string",
      enum:['private','view','edit'],
      required:true,
      defaultsTo:"private" //could be admin, normal
    },
    items:{
      collection:'playlistItem',
      via:'belongsTo'
    }
  }
};

