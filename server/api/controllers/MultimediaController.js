/**
 * MultimediaController
 *
 * @description :: Server-side logic for managing Multimedias
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');

module.exports = {
    //get metadata info from various video hosting websites
    //alternatively you can put "youtube-dl":"git+ssh://git@github.com:yunjiali/node-youtube-dl.git" in package.json to use my own fork of youtube-dl
    /**
     *
     * @param query.url: the url of the video
     * @param query.subtitles: true or false, whether to get subtitle list or not
     */
    metadata:function(req,res){
        var url = req.query.url;
        YouTubeService.getMetadata(url, function(err, info) {
            if (err) return res.badRequest(err);

            if(req.query.subtitles === "true"){
                YouTubeService.getSubtitleList(url, function(errsl, sl) {
                    if (errsl) return res.badRequest(errsl);

                    info.subtitles = sl;

                    return res.json(info);
                });
            }
            else {
                return res.json(info);
            }
        });
    }
};

