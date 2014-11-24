/**
 * Created by Yunjia Li on 19/11/2014.
 * Policy to see if there a title
 */

var validator = require('validator');

module.exports = function(req, res, next) {
    if(!req.body || !req.body.title)
        return res.badRequest(sails.__("Missing parameter %s.", "title"));

    next();
};
