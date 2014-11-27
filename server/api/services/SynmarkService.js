/**
 * Created by user on 24/11/2014.
 */

var Q = require('q');

module.exports = {
    /**
     *
     * @param playlistItemId: the playlist item id
     * @param synmarkId: the synmark id
     * @param callback: the callback method
     * @returns {promise|*|Q.promise}
     */
    belongsToPlaylistItem:function(playlistItemId, synmarkId, callback){
        var deferred = Q.defer();
        PlaylistItemSynmark.findOne({playlistItem: playlistItemId, synmark:synmarkId})
            .then(function(playlistItemSynmark){
                var inPlaylistItem = false;
                if(playlistItemSynmark){
                    inPlaylistItem = true;
                }

                //console.log(playlistItemSynmark+":"+playlistItemId+":"+synmarkId);

                deferred.resolve(inPlaylistItem);
            })
            .fail(function(err){
                deferred.reject(err);
            });

        deferred.promise.nodeify(callback);
        return deferred.promise;
    }

}

