/**
 * Created by user on 24/11/2014.
 */

/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: if the access_token presents, get the user
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
module.exports = function(req, res, next) {
    if(req.query && req.query.access_token) {
        waterlock.validator.validateTokenRequest(req, function (err, user) {
            if (err) {
                return res.forbidden(err);
            }

            // valid request
            next();
        });
    }
    else
        next();
};
