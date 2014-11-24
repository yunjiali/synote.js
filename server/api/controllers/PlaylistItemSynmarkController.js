/**
 * PlaylistItemSynmarkController
 *
 * @description :: Server-side logic for managing Playlistitemsynmarks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    addsynmark:function(req,res){
        //check permission first
        if(req.session.playlistItem.multimedia.id !== req.session.synmark.annotates.id){
            res.badRequest(sails.__("The synmark doesn't annotate the multimedia."));
        }

        var playlistItemSynmark = {};

        playlistItemSynmark.playlistItem = req.session.playlistItem;
        playlistItemSynmark.synmark = req.session.synmark;
        var plTitle = req.session.playlistItem.belongsTo.title;


        PlaylistItemSynmark.create(playlistItemSynmark).exec(function(err,newplis){

            //console.log('here2');

            if(err) return res.serverError(err);

            return res.json({success:true,message:sails.__("synmark has been successfully added to the playlist %s",plTitle),plisid:newplis.id});
        });
    },

    removesynmark:function(req,res){
        //check permission first
        var playlistItem = req.session.playlistItem;
        var synmark = req.session.synmark;
        var plTitle = playlistItem.belongsTo.title;

        PlaylistItemSynmark.destroy({playlistItem: playlistItem.id, synmark:synmark.id}, function(err,newpli){
            if(err) return res.serverError(err);

            return res.json({success:true,message:sails.__("synmark has been successfully removed from the playlist %s",plTitle)});
        });
    }
};

