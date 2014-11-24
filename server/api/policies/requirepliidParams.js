/**
 * Created by user on 23/11/2014.
 */

module.exports = function(req, res, next) {
    if(!req.params || !req.params.pliid)
        return res.badRequest(sails.__("Missing parameter %s.", "pliid"));

    var pliid = req.params.pliid;

    PlaylistItem.findOne().where({id:pliid}).populate('belongsTo').populate('multimedia').exec(function(err, playlistItem){
        if(err) return res.serverError(err);
        if(!playlistItem) return res.badRequest(sails.__("Cannot find the playlist item."));

        req.session.playlistItem = playlistItem;
        next();
    });

};
