/**
 * Created by Yunjia Li on 22/11/2014.
 * Require multimedia id
 */

module.exports = function(req, res, next) {

    if(!req.body || !req.body.mmid)
        return res.badRequest(sails.__("Missing parameter %s.", "mmid"));

    var mmid = req.body.mmid;

    Multimedia.findOne().where({id:mmid}).populate('owner').populate('tags').exec(function(err, multimedia){
        if(err) return res.serverError(err);
        if(!multimedia) return res.badRequest(sails.__("Cannot find the multimedia resource."));

        req.session.multimedia = multimedia;
        next();
    });

};