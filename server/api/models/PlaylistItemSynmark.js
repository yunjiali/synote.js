/**
* PlaylistItemSynmark.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    playlistItem:{
      model:'PlaylistItem'
    },
    synmark:{
      model:'synmark'
    }
  },

  beforeValidate:function(values,next){
    //Duplicate checking
    var playlistItem = values.playlistItem;
    var synmark = values.synmark;
    PlaylistItemSynmark.findOne({playlistItem:playlistItem, synmark:synmark}, function(err, plis){
      if(err) return next(err);
      if(plis) return next(new Error(sails.__('The synmark has already been added in the playlist item.')));
      next();
    });
  }
};

