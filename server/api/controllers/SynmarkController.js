/**
 * SynmarkController
 *
 * @description :: Server-side logic for managing Synmarks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var S = require('string');
var randomstring = require("randomstring");

module.exports = {
    /**
     *
     * @param title
     * @param content
     * @param tags
     * @param permission
     * @param mfst
     * @param mfet
     * @param timeformat
     * @param mfx
     * @param mfy
     * @param mfw
     * @param mfh
     * @param xywhunit
     */
	create:function(req,res){

        //TODO: check permission first, maybe write a policy for it

        var synmark = {};

        if(req.body.title){
            synmark.title = S(req.body.title).trim().s;
        }

        if(req.body.content){
            synmark.content = S(req.body.content).trim().s;
        }

        if(req.body.permission){
            synmark.permission = S(req.body.permission).trim().s;
        }

        if(req.body.tags){
            var tags = req.body.tags.split(',');

            synmark.tags = [];
            for(var i=0;i<tags.length;i++){
                var tag = S(tags[i]).trim().s;
                if(tag) {
                    synmark.tags.push({text: S(tags[i]).trim().s, owner: req.session.user.id, rsid: randomstring.generate()});
                }
            }

        }

        synmark.mfst = parseInt(req.body.mfst);

        if(req.body.mfet){
            if(!isNaN(parseInt(req.body.mfet))){
                synmark.mfet = parseInt(req.body.mfet);
            }
            else
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfet" )));
        }

        if(req.body.timeformat){
            synmark.timeformat = S(req.body.timeformat).trim().s;
        }

        //xywh must present together
        if((req.body.mfx && req.body.mfy && req.body.mfw && req.body.mfh)){
            if(!isNaN(parseInt(req.body.mfx))){
                synmark.mfx = parseInt(req.body.mfx);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfx" )));
            }

            if(!isNaN(parseInt(req.body.mfy))){
                synmark.mfy = parseInt(req.body.mfy);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfy" )));
            }

            if(!isNaN(parseInt(req.body.mfw))){
                synmark.mfw = parseInt(req.body.mfw);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfw" )));
            }

            if(!isNaN(parseInt(req.body.mfh))){
                synmark.mfh = parseInt(req.body.mfh);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfh" )));
            }
        }

        if(req.body.xywhunit){
            synmark.xywhunit = S(req.body.xywhunit).trim().s;
        }

        synmark.annotates = req.session.multimedia.id;
        synmark.owner = req.session.user.id;
        synmark.rsid = randomstring.generate();

        Synmark.create(synmark).exec(function(err, newsynmark){
            if(err) return res.serverError(err);

            return res.json({success:true, message:sails.__("%s has been successfully created", "Synmark"), synmarkid:newsynmark.id});
        })
    },

    get:function(req,res){
        var synmarkid = req.params.synmarkid;
        Synmark.findOne({id:synmarkid}).then(function(synmark){
            return res.json(synmark);
        })
    },

    save:function(req,res){
        var synmark = req.session.synmark;

        if(req.body.title){
            synmark.title = S(req.body.title).trim().s;
        }

        if(req.body.content){
            synmark.content = S(req.body.content).trim().s;
        }

        if(req.body.permission){
            synmark.permission = S(req.body.permission).trim().s;
        }

        if(req.body.tags){
            //deal with tags
        }

        synmark.mfst = parseInt(req.body.mfst);

        if(req.body.mfet){
            if(!isNaN(parseInt(req.body.mfet))){
                synmark.mfet = parseInt(req.body.mfet);
            }
            else
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfet" )));
        }

        if(req.body.timeformat){
            synmark.timeformat = S(req.body.timeformat).trim().s;
        }

        //xywh must present together
        if((req.body.mfx && req.body.mfy && req.body.mfw && req.body.mfh)){
            if(!isNaN(parseInt(req.body.mfx))){
                synmark.mfx = parseInt(req.body.mfx);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfx" )));
            }

            if(!isNaN(parseInt(req.body.mfy))){
                synmark.mfy = parseInt(req.body.mfy);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfy" )));
            }

            if(!isNaN(parseInt(req.body.mfw))){
                synmark.mfw = parseInt(req.body.mfw);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfw" )));
            }

            if(!isNaN(parseInt(req.body.mfh))){
                synmark.mfh = parseInt(req.body.mfh);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfh" )));
            }
        }

        if(req.body.xywhunit){
            synmark.xywhunit = S(req.body.xywhunit).trim().s;
        }

        synmark.save().then(function(newsynmark){
            return res.json({success:true, message:sails.__("%s has been successfully created", "Synmark"), synmarkid:newsynmark.id});

        }, function(err){
            return res.serverError(err);
        })
    }
};

