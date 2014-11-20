/**
 * Created by user on 19/11/2014.
 */

var request = require('supertest-as-promised');
var async = require('async');
var should = require('should');


describe('MultimediaController', function() {

    describe('GET /multimedia/metadata ', function () {

        var youtubeURL = "http://www.youtube.com/watch?v=AZeXETmatZk";
        var youtubeURLSubtitles = "https://www.youtube.com/watch?v=5MgBikgcWnY";
        //var dailymotionURL = "http://www.dailymotion.com/video/x1tlo7u_britain-s-got-talent-2013-168-final-shadow-theatre-of-attraction-with-a-great-british-montage_music";
        //var vimeoURL = "http://vimeo.com/1105548";

        beforeEach(function(done){
            request(sails.hooks.http.app)
                .post('/auth/logout')
                .expect(200, done);
        });

        it('should not get access if not logged in', function (done) {
            request(sails.hooks.http.app)
                .get('/multimedia/metadata')
                .expect(403,done)
        });

        it('should get youtube metadata', function (done) {
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback();
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            callback(null, resObj.token);
                        })
                },
                function(token, callback){
                    agent
                        .get('/multimedia/metadata?access_token='+token+"&url="+encodeURI(youtubeURL))
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.id.should.equal("AZeXETmatZk");
                            callback();
                        });
                }
            ],function(err, results){
                done();
            });
        });

        it('should get youtube metadata with subtitles', function (done) {
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback();
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            callback(null, resObj.token);
                        })
                },
                function(token, callback){
                    agent
                        .get('/multimedia/metadata?access_token='+token+"&url="+encodeURI(youtubeURLSubtitles)+"&subtitles=true")
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.id.should.equal("5MgBikgcWnY");
                            resObj.should.have.property("subtitles");
                            callback();
                        });
                }
            ],function(err, results){
                done();
            });
        });

        //Dailymotion doesn't work for youtube-dl at the moment
        /*it('should get dailymotion metadata', function (done) {
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback();
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            callback(null, resObj.token);
                        })
                },
                function(token, callback){
                    agent
                        .get('/multimedia/metadata?access_token='+token+"&url="+encodeURI(dailymotionURL))
                        .expect(200)
                        .end(function(err, res2){
                            res2.title.should.exists();
                            callback();
                        });
                }
            ],function(err, results){
                done();
            });
        });*/

        /* haven't implemented Vimeo yet
        it('should get vimeo metadata', function (done) {
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback();
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            callback(null, resObj.token);
                        })
                },
                function(token, callback){
                    agent
                        .get('/multimedia/metadata?access_token='+token+"&url="+encodeURI(vimeoURL))
                        .expect(200)
                        .end(function(err, res2){
                            res2.title.should.exists();
                            callback();
                        });
                }
            ],function(err, results){
                done();
            });
        });*/

        //TODO: add a couple of bad examples: http://www.youtube.com/watch?v=WKsjaOqDXgg BBC banned it
    });

    //
    /*describe('GET /rtest/restricted', function () {
     it('should get open access', function () {
     request(sails.hooks.http.app)
     .get('/rtest/open')
     .expect(200);
     });
     });*/
});
