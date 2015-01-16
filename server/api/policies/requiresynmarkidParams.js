/**
 * Created by user on 23/11/2014.
 */

module.exports = function(req, res, next) {
    if(!req.params || !req.params.synmarkid)
        return res.badRequest(sails.__("Missing parameter %s.", "synmarkid"));

    var synmarkid = req.params.synmarkid;

    Synmark.findOne().where({id:synmarkid}).populate('annotates').populate('owner').exec(function(err, synmark){
        if(err) return res.serverError(err);
        if(!synmark) return res.badRequest(sails.__("Cannot find the synmark."));

        req.session.synmark = synmark;
        next();
    });

};
