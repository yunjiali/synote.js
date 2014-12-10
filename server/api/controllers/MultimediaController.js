/**
 * MultimediaController
 *
 * @description :: Server-side logic for managing Multimedias
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
var S = require('string');
var _ = require('lodash');
var validator = require('validator');
var randomstring = require("randomstring");
var Q = require('q');


module.exports = {
    //get metadata info from various video hosting websites
    //alternatively you can put "youtube-dl":"git+ssh://git@github.com:yunjiali/node-youtube-dl.git" in package.json to use my own fork of youtube-dl
    /**
     * Get
     * @param query.url: the url of the video
     * @param query.subtitles: true or false, whether to get subtitle list or not
     */
    metadata:function(req,res){
        var url = req.query.url;

        //is YouTube video
        if(UtilsService.isYouTubeURL(url)){
            YouTubeService.getMetadata(url, function(err, info) {
                if (err) return res.badRequest(err);

                if(req.query.subtitles === "true"){
                    YouTubeService.getSubtitleList(url, function(errsl, sl) {
                        if (errsl) return res.badRequest(errsl);

                        info.subtitles = sl;

                        return res.json(info);
                    });
                }
                else {
                    return res.json(info);
                }
            });
        }
        else{ //is a random file
            FFmpegService.getMetadata(url, function(err, info){
                if (err) return res.badRequest(err);
                else return res.json(info);
            });
        }

    },
    /**
     * Post
     * @param title
     * @param description
     * @param url
     * @param permission
     * @param tags: separated by comma
     * @param duration
     * @param starttime
     * @param mtype
     * @param thumbnail
     * @param isVideo
     * @param subtitles: a list ["format,lang,url","format,lang,url|...
     */
    create:function(req,res){
        var multimedia = {};

        if(typeof req.body.duration === 'string')
            console.log("string");
        else
            console.log('number');

        multimedia.title = S(req.body.title).trim().s;
        if(req.body.description) {
            multimedia.description = S(req.body.description).trim().s
        }

        if(req.body.url){
            multimedia.url = S(req.body.url).trim().s;
        }

        if(req.permission){
            multimedia.permission = S(req.body.permission).trim(0).s;
        }

        if(req.body.tags){
            var tags = req.body.tags.split(',');

            multimedia.tags = [];
            for(var i=0;i<tags.length;i++){
                var tag = S(tags[i]).trim().s;
                if(tag) {
                    multimedia.tags.push({text: S(tags[i]).trim().s, owner: req.session.user.id, rsid: randomstring.generate()});
                }
            }

        }

        if(req.body.duration) {
            if(validator.isInt(req.body.duration))
                multimedia.duration = parseInt(req.body.duration);
            else
                return res.badRequest((sails.__("Parameter %s is not valid.", "duration" )));
        }

        if(req.body.starttime){
            var datetime = new Date(S(req.body.starttime).trim().s).toISOString();
            if(!datetime){
                return res.badRequest((sails.__("Parameter %s is not valid.", "starttime" )));
            }

            multimedia.starttime = datetime;
        }

        //TODO: write utils to decide if video
        if(req.body.mtype){
            multimedia.mtype = req.body.mtype;
        }

        if(req.body.thumbnail){
            multimedia.thumbnail = S(req.body.thumbnail).trim().s;
        }

        if(typeof req.body.isVideo !== 'undefined' && req.body.isVideo === 'false'){
            multimedia.mtype = "audio";
        }

        multimedia.owner = req.session.user.id;
        multimedia.rsid = randomstring.generate();

        if(req.body.subtitles){
            var subtitles = req.body.subtitles
            //console.log(req.body.subtitles);
            multimedia.transcripts = [];
            async.eachSeries(subtitles, function(subtitleStr, callbackSub){
                var items = subtitleStr.split(",");
                if(items.length !== 3)
                    callbackSub(sails.__("Parameter %s is not valid.", "subtitles"))

                var subtitle = {};
                subtitle.owner = req.session.user.id;
                subtitle.rsid = randomstring.generate();
                //subtitle.format = items[0];
                subtitle.lang = items[1];
                //subtitle.url = items[2];
                subtitle.cues = [];

                if(items.length !== 3){
                    return callbackSub(sails.__("Parameter %s is not valid.", "subtitles" ))
                }
                //download the subtitle
                SubtitleService.getSubtitleSRT(items[2],items[1], function(errSub, subData){
                    if(errSub)
                        callbackSub(errSub);

                    for(var i=0;i<subData.length;i++)
                    {
                        var sObj = {};
                        sObj.setting="";
                        sObj.owner = req.session.user.id;
                        sObj.ind = subData[i].number;
                        sObj.rsid = randomstring.generate(); //randomly generate uuid
                        sObj.content = subData[i].languages[items[1]];
                        sObj.st=subData[i].startTime;
                        sObj.et=subData[i].endTime;
                        subtitle.cues.push(sObj);
                    }

                    multimedia.transcripts.push(subtitle);
                    callbackSub(null);
                });

            }, function(err, results){
                if(err) return res.badRequest(err);

                Multimedia.create(multimedia).exec(function(errMultimedia,newmm){
                    if(errMultimedia){
                        return res.serverError(errMultimedia);
                    }
                    return res.json({success:true, message:sails.__("%s has been successfully created", multimedia.title), mmid:newmm.id});

                });
            });
        }
        else{
            Multimedia.create(multimedia).exec(function(errMultimedia,newmm){
                if(errMultimedia){
                    return res.serverError(errMultimedia);
                }
                return res.json({success:true, message:sails.__("%s has been successfully created", multimedia.title), mmid:newmm.id});

            });
        }
    },
    /**
     * Get multimedia
     * @param mmid
     * @param pliid (optional): the pliid that currently playing
     */
    get: function(req,res){
        //TODO: get different things with different permission
        //if playlist in query get synmark belongs to a playlist
        //if user not logged in, no playlist is returned
        var multimedia = req.session.multimedia;
        var pliid;

        if(req.query && req.query.pliid){
            if(!isNaN(parseInt(req.query.pliid))){
                pliid = parseInt(req.query.pliid);
            }
            else
                res.badRequest(sails.__("Parameter %s is not valid.", "pliid"));
        }

        var synmarkPromise = Synmark.find({annotates:multimedia.id}).populate('tags').populate('owner')
            .then(function(synmarks){
                if(typeof pliid === 'undefined')
                    return synmarks;
                else{
                    //the multimedia will be played in a playlist, so we will get if synmarks in this playlist
                    var synmarkPromises = synmarks.map(function(synmark){
                        return SynmarkService.belongsToPlaylistItem(pliid,synmark.id)
                            .then(function(inPlaylistItem){
                                synmark.inPlaylistItem = inPlaylistItem;
                                return synmark;
                            });
                    });
                    return Q.all(synmarkPromises).then(function(synmarks){
                        //console.log(synmarks);
                        return synmarks;
                    });
                }
            });

        var multimediaPromises = [];
        multimediaPromises.push(synmarkPromise);

        var playlistsPromise;
        if(req.session.user){
            playlistsPromise = Playlist.find({owner:req.session.user.id}).populate('items',{sort:'ind ASC'})
                .then(function(transcripts){return transcripts;});
            multimediaPromises.push(playlistsPromise);
        }
        else{
            playlistsPromise = UtilsService.emptyPromise();
        }

        Q.all(multimediaPromises)
        .spread(function(synmarks,playlists){
            var data = {};
            data.multimedia = multimedia;
            data.synmarks = synmarks;
            if(typeof playlists !== 'undefined')
                data.playlists = playlists;
            return res.json(data);
        })
        .catch(function(err){
            return res.serverError(err);
        });
    }
};

