/**
 * Created by user on 07/03/15.
 */


module.exports = function(req, res, next) {
    if(!req.query || !req.query.q)
        return res.badRequest(sails.__("Missing parameter %s.", "q"));

    next();
};