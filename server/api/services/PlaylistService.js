/**
 * Created by user on 27/11/2014.
 */

var Q = require('q');

module.exports={

    /**
     * List playlist detail with items' details
     * @param plid: the playlist id
     * @param callback
     * @returns {promise|*|Q.promise}
     */
    listPlaylistItems:function(plid, callback){
        var deferred = Q.defer();
        var playlistPromise = Playlist.findOne({id: plid});
        var playlistItemsPromise = PlaylistItem.find({belongsTo:plid}).populate('multimedia');

        Q.all([playlistPromise,playlistItemsPromise])
            .spread(function(playlist,playlistItems){
                var data = {};
                data.playlist = playlist;
                data.items = playlistItems;
                deferred.resolve(data);
            })
            .catch(function(err){
                deferred.reject(err);
            });

        deferred.promise.nodeify(callback);
        return deferred.promise;
    }
}
