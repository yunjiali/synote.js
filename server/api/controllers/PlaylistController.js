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
var _=require('lodash');

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
            playlist.publicPermission = req.body.permission;
        }

        playlist.rsid = randomstring.generate();
        playlist.owner = req.session.user.id;


        Playlist.create(playlist).exec(function(err, newpl){
            if(err){
                return res.serverError(err);
            }
            return res.json({success:true, message:sails.__("Playlist %s has been successfully created.", newpl.title), plid:newpl.id});
        });
    },

    save:function(req,res){
        var playlist = req.session.playlist;
        var updatedpl = {};

        if(req.body.title){
            updatedpl.title = S(req.body.title).trim().s;
        }

        if(req.body.description){
            updatedpl.description = S(req.body.description).trim().s;
        }

        if(req.body.permission){
            updatedpl.publicPermission = req.body.permission;
        }

        //console.log("plid:"+playlist.id);
        Playlist.update({id:playlist.id},updatedpl).then(function(newpl){
            return res.json({success:true, message:sails.__("Playlist %s has been successfully updated.", newpl[0].title), plid:newpl[0].id});
        }, function(err){
            return res.serverError(err);
        });
    },

    /**
     * @param no parameter
     */
    list:function(req,res){
        var owner = req.session.user.id;
        Playlist.find({owner:owner}).populate('items').exec(function(err, pls){
            if(err)
                return res.serverError(err)
            return res.json(pls);
        })
    },

    /**
     * @param items
     * This function is mainly used to change the order of playlist items and remove any playlist item
     */

    saveitems:function(req,res){
        //req.body.items a list of playlistitems
        //itemid, ind
        //if ind === -1, which means it has been removed

        //receive a list and only change ind, if removed, remove it

        //check permission first
        //console.log(req);

        //TODO: check items array is valid
        //for example [{id:1,ind:2},{id:1, ind:3}] shouldn't be valid

        var items = req.body;
        if(!items){
            return res.badRequest(sails.__("Playlist items are not valid."));
        }

        var playlist = req.session.playlist;
        //console.log(items);
        var oldItemIDs = playlist.items.map(function(item){
            return item.id;
        });
        var newItemIDs = items.map(function(item){
            return item.id;
        });

        var deletedItemIDs = _.difference(oldItemIDs, newItemIDs);

        for(var i=0;i<deletedItemIDs.length;i++){
            items.push({id:deletedItemIDs[i],ind:-1});
        }

        //console.log(deletedItemIDs);
        //console.log(newItemIDs);

        async.eachSeries(items,function(item, itemCallback){
            if(typeof item.id === "undefined"){ //new playlist item
                //TODO: not yet implemented
            }
            else if(item.id){
                if(item.ind === -1){//should be deleted
                    PlaylistItem.destroy({id:item.id}).then(
                        function(){
                            itemCallback(null);
                        },
                        function(destroyErr){
                            itemCallback(destroyErr);
                        }
                    )
                }
                else{ //should be updated
                    PlaylistItem.update({id:item.id},{ind:item.ind}).then(
                        function(newItems){
                            itemCallback(null);
                        },
                        function(updateErr){
                            itemCallback(updateErr);
                        }
                    )
                }
            }
        }, function(err){
            if(err){
                return res.serverError(err);
            }
            return res.json({success:true, message:sails.__("The playlist has been successfully updated.")});
        });
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

        var playlistPromise = Playlist.findOne({id: plid}).populate('owner');
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

