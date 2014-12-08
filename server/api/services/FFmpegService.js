/**
 * Created by user on 07/12/2014.
 */

var ffmpeg = require('fluent-ffmpeg');

module.exports = {
    //get metadata of any file
    getMetadata:function(url,callback){
        ffmpeg.ffprobe(url, function(err, metadata){
            if(err)
                return callback(err);

            //transform to new metadata standard
            var newObj = {};
            newObj.id = null;
            newObj.metadata = {};
            newObj.metadata.title = "";
            newObj.metadata.description = "";
            newObj.metadata.duration = Math.ceil(metadata.format.duration);
            newObj.metadata.language = null;
            newObj.metadata.creationDate = metadata.format.tags.date ;
            newObj.metadata.publicationDate = metadata.format.tags.date;
            newObj.metadata.isVideo = true;//metadata.isVideo;
            newObj.metadata.thumbnail = null ;
            newObj.metadata.category = {};
            newObj.metadata.category.id = null;
            newObj.metadata.category.label = null;
            newObj.metadata.category.uri=null;
            newObj.statistics = {};
            newObj.statistics.views = null;
            newObj.statistics.comments = null;
            newObj.statistics.favorites = null;
            newObj.statistics.ratings = null;

            return callback(null,newObj);
        });
    }
}
