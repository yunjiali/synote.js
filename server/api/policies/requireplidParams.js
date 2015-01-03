/**
 * Created by Yunjia Li on 22/11/2014.
 * Require Playlist id
 */

module.exports = function(req, res, next) {
    if(!req.params || !req.params.plid)
        return res.badRequest(sails.__("Missing parameter %s.", "plid"));

    var plid = req.params.plid;

    Playlist.findOne().where({id:plid}).populate('owner').exec(function(err, playlist){
        if(err) return res.serverError(err);
        if(!playlist) return res.badRequest(sails.__("Cannot find the playlist."));

        req.session.playlist = playlist;
        next();
    });

};

