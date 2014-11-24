/**
 * Created by user on 24/11/2014.
 */

module.exports = {
    belongsToPlaylistItem:function(playlistItemId, synmarkId, callback){
        PlaylistItemSynmark.find({playlistItem: playlistItemId, synmark:synmarkId})
    }

}

