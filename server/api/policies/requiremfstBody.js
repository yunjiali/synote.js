/**
 * Created by user on 22/11/2014.
 */

var validator = require('validator');

module.exports = function(req, res, next) {
    if(!req.body || !req.body.mfst)
        return res.badRequest(sails.__("Missing parameter %s.", "mfst"));

    if(isNaN(parseInt(req.body.mfst)) || parseInt(req.body.mfst) < 0)
        return res.badRequest((sails.__("Parameter %s is not valid.", "mfst" )));

    next();
};