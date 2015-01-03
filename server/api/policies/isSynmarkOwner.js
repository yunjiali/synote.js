/**
 * Created by user on 16/12/14.
 */

module.exports = function(req, res, next) {

    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    var owner = req.session.user;
    var multimedia = req.session.synmark;

    if (!req.session.user || !req.session.synmark) {
        return res.badRequest(sails.__('Bad request.'));
    }


    if (owner.id !== synmark.owner.id){
        return res.forbidden(sails.__('You are not permitted to perform this action.'));
    }

    return next();

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)

};
/**
 * Created by user on 16/12/14.
 */
