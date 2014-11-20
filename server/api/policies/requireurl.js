/**
 * Created by Yunjia Li on 19/11/2014.
 * Policy to see if it is a url
 */

var validator = require('validator');

module.exports = function(req, res, next) {
    if(!req.query.url)
        return res.badRequest(sails.__("Missing parameter url."));

    var url = req.query.url;
    if(!validator.isURL(url))
        return res.badRequest((sails.__("Parameter url is not valid." )));

    next();
};
