/**
 * MultimediaController
 *
 * @description :: Server-side logic for managing Multimedias
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
var S = require('string');
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
    get: function(req,res){
        //TODO: get different things with different permission
        //if playlist in query get synmark belongs to a playlist
        var multimedia = req.session.multimedia;
        Q.all([
            Synmark.find({annotates:multimedia.id}).populate('tags').populate('owner')
                .then(function(synmarks){return synmarks;}),
            Transcript.find({annotates:multimedia.id}).populate('cues').populate('owner')
                .then(function(transcripts){return transcripts;}),
            Playlist.find({owner:req.session.user.id}).populate('items')
                .then(function(transcripts){return transcripts;})
        ])
        .spread(function(synmarks,transcripts,playlists){
            var data = {};
            data.multimedia = multimedia;
            data.synmarks = synmarks;
            data.transcripts = transcripts;
            data.playlists = playlists;
            return res.json(data);
        })
        .catch(function(err){
            return res.serverError(err);
        });
    }
    /*
    gettest:  function(req,res){
        //TODO: get different things with different permission
        //if playlist in query get synmark belongs to a playlist
        var multimedia = req.session.multimedia;
        multimedia.populate('synmarks').exec(function(err,newmm){

            return json

        });
    }*/
};

