/**
* PlaylistItem.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  //just a synmark with an order in the list
  attributes: {
    belongsTo:{
      model:'Playlist'
    },
    multimedia:{
      model:'multimedia'
    },
    ind:{ //index of the multiemdia resource
      type:'integer',
      required:true,
      min:1
    },
    synmarks:{
      collection:'synmark',
      via:'belongsToPlaylistItems'
    }
  }
};

