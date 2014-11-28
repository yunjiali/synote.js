/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing Playlists
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');
var S = require('string');
var validator = require('validator');
var randomstring = require("randomstring");
var Q = require('q');

module.exports = {
    /**
     * @param title
     * @param description
     * @param permission
     */
	create:function(req,res){
        var playlist = {};
        playlist.title = req.body.title;
        if(req.body.description){
            playlist.description = S(req.body.description).trim().s;
        }

        if(req.body.permission){
            playlist.permission = req.body.permission;
        }

        playlist.rsid = randomstring.generate();
        playlist.owner = req.session.user.id;


        Playlist.create(playlist).exec(function(err, newpl){
            console.log("abd");
            if(err){
                return res.serverError(err);
            }
            return res.json({success:true, message:sails.__("Playlist %s has been successfully created", newpl.title), plid:newpl.id});
        });
    },

    /**
     * @param items
     * TODO: implement
     */

    saveitems:function(req,res){
        //req.body.items a list of playlistitems
        //itemid, ind
        //if ind === -1, which means it has been removed

        //check permission first
    },

    /**
     *
     * @param playlist: passed forward from policy
     * @param multimedia: passed forward from policy
     * @param
     */
    additem:function(req,res){

        //check playlist permission first
        var playlist = req.session.playlist;
        var multimedia = req.session.multimedia;

        //create a new playlistitem from multimedia
        var playlistitem = {};
        playlistitem.belongsTo = playlist.id;
        playlistitem.multimedia = multimedia.id;
        playlistitem.rsid = randomstring.generate();
        playlistitem.ind = playlist.items.length+1;

        PlaylistItem.create(playlistitem).exec(function(err,newpli){
            if(err){
                return res.serverError(err);
            }
            return res.json({success:true, message:sails.__("%s has been successfully added to playlist %s", multimedia.title, playlist.title), pliid:newpli.id});
        });
    },

    /**
     * Get playlist, including the playlist items (multimedias)
     * @param plid: playlist id from params
     */
    get:function(req,res){
        //TODO: get different things with different permission
        //var playlist = req.session.playlist;
        var plid = req.params.plid;

        var playlistPromise = Playlist.findOne({id: plid});
        var playlistItemsPromise = PlaylistItem.find({belongsTo:plid}).populate('multimedia');

        Q.all([playlistPromise,playlistItemsPromise])
            .spread(function(playlist,playlistItems){
                var data = {};
                data.playlist = playlist;
                data.items = playlistItems;
                return res.json(data);
            })
            .catch(function(err){
                return res.serverError(err);
            });
    }
};

