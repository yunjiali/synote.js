/**
 * TagController
 *
 * @description :: Server-side logic for managing Tags
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('underscore');
module.exports = {
    list:function(req,res) {
        var ownerId = req.session.user.id;
        Tag.find({owner:ownerId}).then(function(tags){
            return res.json({success:true, tags:tags});
        });
    },
    listJQCloud:function(req,res){ //this method is designed to get jqCloud words data structure in order to reduce traffic
        var ownerId = req.session.user.id;
        Tag.find({owner:ownerId}).then(function(tags){
            var words = tags.map(function(tag){return tag.text;});
            var wordsUnique = _.uniq(words);
            var wordsObj = [];
            for(var i=0;i<wordsUnique.length;i++){
                var wordObj = {};
                wordObj.text = wordsUnique[i];
                wordObj.weight = _.filter(words, function(word){return word === wordsUnique[i];}).length;
                wordsObj.push(wordObj);
            }
            return res.json({success:true, words:wordsObj});
        });
    },

    listSynmarkTagJQCloud:function(req,res){ //list only tags for synmark
        var ownerId = req.session.user.id;
        Tag.find({owner:ownerId,ownersynmark:{'!':null}}).then(function(tags){
            var words = tags.map(function(tag){return tag.text;});
            var wordsUnique = _.uniq(words);
            var wordsObj = [];
            for(var i=0;i<wordsUnique.length;i++){
                var wordObj = {};
                wordObj.text = wordsUnique[i];
                wordObj.weight = _.filter(words, function(word){return word === wordsUnique[i];}).length;
                wordsObj.push(wordObj);
            }
            return res.json({success:true, words:wordsObj});
        });
    }
};

