/**
 * Created by user on 19/11/2014.
 */

var request = require('supertest-as-promised');
var async = require('async');
var should = require('should');
var _ = require('lodash');


describe('MultimediaController', function() {
    describe('GET /multimedia/metadata ', function () {

        var youtubeURL = "http://www.youtube.com/watch?v=AZeXETmatZk";
        var youtubeURLSubtitles = "https://www.youtube.com/watch?v=5MgBikgcWnY";
        var webmURL = "https://dl.dropboxusercontent.com/u/51617581/bigbuck.webm";
        //var audioURL = "https://dl.dropboxusercontent.com/u/51617581/interview.mp3";
        var notValidURL = "https%3A%2F%2Fdl.dropboxusercontent.com%2Fu%2F51617581%2Fbigbuck.webm";
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

        it('should get webm metadata', function (done) {
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
                        .get('/multimedia/metadata?access_token='+token+"&url="+encodeURI(webmURL))
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.metadata.duration.should.equal(27);
                            callback();
                        });
                }
            ],function(err, results){
                done();
            });
        });

        it('should not metadata when the url is invalid', function (done) {
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
                        .get('/multimedia/metadata?access_token='+token+"&url="+encodeURI(notValidURL))
                        .expect(400)
                        .end(function(err, res){
                            res.statusCode.should.equal(400);
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

    describe('POST /multimedia/create', function(){
        var youtubeURLSubtitles = "https://www.youtube.com/watch?v=5MgBikgcWnY";
        var accessToken = "";
        before(function(done){
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
                            accessToken=resObj.token;
                            callback(null, resObj.token);
                        });
                }
            ],function(err, results){
                done();
            });
        });

        it('should not be successful if token is not presented', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/multimedia/create')
                .send({
                    title:"The first 20 hours -- how to learn anything | Josh Kaufman | TEDxCSU",
                    description:"Josh Kaufman is the author of the #1 international bestseller, 'The Personal MBA: Master the Art of Busines",
                    duration:"1167",
                    thumbnail:"https://i.ytimg.com/vi/5MgBikgcWnY/default.jpg",
                    url:"http://www.youtube.com/watch?v=5MgBikgcWnY",
                    tags:"ted,talk,ok"
                })
                .expect(403)
                .end(function(err,res){
                    res.statusCode.should.equal(403);
                    done();
                })
        });

        it('should be successful to create multimedia with tags', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/multimedia/create?access_token='+accessToken)
                .send({
                title:"The first 20 hours -- how to learn anything | Josh Kaufman | TEDxCSU",
                description:"Josh Kaufman is the author of the #1 international bestseller, 'The Personal MBA: Master the Art of Busines",
                duration:"1167",
                thumbnail:"https://i.ytimg.com/vi/5MgBikgcWnY/default.jpg",
                url:"http://www.youtube.com/watch?v=5MgBikgcWnY",
                tags:"ted,talk,ok"
            })
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check tags
                    Multimedia.find(resObj.mmid).populate('tags').exec(function(err, mms){
                        should.exist(mms);
                        mms[0].toJSON().should.have.property('tags').with.lengthOf(3);
                        done();
                    });
                })
        });

        it('should be successful to create multimedia with subtitles', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/multimedia/create?access_token='+accessToken)
                .send({
                    title:"The first 20 hours -- how to learn anything | Josh Kaufman | TEDxCSU",
                    description:"Josh Kaufman is the author of the #1 international bestseller, 'The Personal MBA: Master the Art of Busines",
                    duration:"1167",
                    thumbnail:"https://i.ytimg.com/vi/5MgBikgcWnY/default.jpg",
                    url:"http://www.youtube.com/watch?v=5MgBikgcWnY",
                    tags:"ted,talk,ok",
                    subtitles:["srt,it,http://www.youtube.com/api/timedtext?v=5MgBikgcWnY&fmt=srt&lang=it&name=",
                        "srt,en,http://www.youtube.com/api/timedtext?v=5MgBikgcWnY&fmt=srt&lang=en&name"]
                })
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check tags
                    Multimedia.find(resObj.mmid).populate('transcripts').exec(function(err, mms){
                        should.exist(mms);
                        mms[0].toJSON().should.have.property('transcripts').with.lengthOf(2);
                        Transcript.find({where:{annotates:mms[0].id}}).populate('cues').exec(function(errTrans, transcripts){
                            transcripts[0].toJSON().should.have.property('cues');
                            done();
                        })
                    });
                });
        });

        it('should not be create multimedia if the subtitles param is invalid', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/multimedia/create?access_token='+accessToken)
                .send({
                    title:"The first 20 hours -- how to learn anything | Josh Kaufman | TEDxCSU",
                    description:"Josh Kaufman is the author of the #1 international bestseller, 'The Personal MBA: Master the Art of Busines",
                    duration:"1167",
                    thumbnail:"https://i.ytimg.com/vi/5MgBikgcWnY/default.jpg",
                    url:"http://www.youtube.com/watch?v=5MgBikgcWnY",
                    tags:"ted,talk,ok",
                    subtitles:["it,http://www.youtube.com/api/timedtext?v=5MgBikgcWnY&fmt=srt&lang=it&name=",
                        "srt,en,http://www.youtube.com/api/timedtext?v=5MgBikgcWnY&fmt=srt&lang=en&name"]
                })
                .expect(400)
                .end(function(err,res){
                    res.statusCode.should.equal(400);
                    done();
                });
        });

        it('should be successful to create audio', function(done){
            var agent = request.agent(sails.hooks.http.app);
            agent
                .post('/multimedia/create?access_token='+accessToken)
                .send({
                    title:"Interview audio",
                    description:"This is a test interview audio",
                    duration:"332",
                    url:"https://dl.dropboxusercontent.com/u/51617581/interview.mp3",
                    tags:"audio,interview,ok",
                    isVideo:"false"
                })
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    //check tags
                    Multimedia.findOne(resObj.mmid).exec(function(err, mm){
                        should.exist(mm);
                        mm.mtype.should.equal("audio");
                        done();
                    });
                })
        });

        //it('should successfully create multimedia with subtitles', function(done){
        //
        //});
    });

    //TODO: get multimedia
    describe('GET /multimedia/get', function(){
        var agent,accessToken;
        before(function(done){
            agent = request.agent(sails.hooks.http.app);
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
                            accessToken=resObj.token;
                            callback(null, resObj.token);
                        });
                }
            ],function(err, results){
                done();
            });
        });

        it("should get multimedia with synmarks if logged in", function(done){
            agent
                .get('/multimedia/get/'+global.bootstrap.multimedia.mmid1+'?access_token='+accessToken)
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    resObj.synmarks.length.should.greaterThan(0);
                    //check tags
                    done();
                })
        });

        it("should get the current playlist if pliid is presented", function(done){
            agent
                .get('/multimedia/get/'+global.bootstrap.multimedia.mmid1+'?pliid='+global.bootstrap.playlistitem.pliid1+'&access_token='+accessToken)
                .expect(200)
                .end(function(err,res){
                    var resObj = JSON.parse(res.text);
                    //console.log(resObj.playlist);

                    resObj.success.should.equal(true);
                    should.exist(resObj.playlistItem);
                    //should.exist(resObj.playlistItem);
                    resObj.playlistItem.playlist.items.length.should.greaterThan(0);
                    done();
                })
        });
    });

    describe('GET /multimedia/listByOwner', function(){
        var agent,accessToken;
        before(function(done){
            agent = request.agent(sails.hooks.http.app);
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
                            accessToken=resObj.token;
                            callback(null, resObj.token);
                        });
                }
            ],function(err, results){
                done();
            });
        });


        it("should list owner's multimedia successfully", function(done){

            agent
                .get('/multimedia/listByOwner?access_token='+accessToken)
                .expect(200)
                .end(function(err,res){
                    res.statusCode.should.equal(200);
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    resObj.count.should.greaterThan(0);
                    resObj.mms.length.should.greaterThan(0);
                    done();
                });

        });

        it("should list owner's multimedia with skip and limit", function(done){
            agent
                .get('/multimedia/listByOwner?access_token='+accessToken+'&skip=1&limit=2')
                .expect(200)
                .end(function(err,res){
                    res.statusCode.should.equal(200);
                    var resObj = JSON.parse(res.text);
                    resObj.success.should.equal(true);
                    resObj.mms.length.should.equal(2);
                    done();
                });
        });
    });

    describe('POST /multimedia/save/:mmid ', function(){
        var accessToken = "";
        var mmid="";
        var mmid2=""
        before(function(done){
            mmid= global.bootstrap.multimedia.mmid1;
            mmid2= global.bootstrap.multimedia.mmid2;
            done();
        });

        it('should edit multimedia successfully', function(done){
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback(null);
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            accessToken=resObj.token;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/multimedia/save/'+mmid+'?access_token='+accessToken)
                        .send({title:'editedmultimedia16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPhdd', description:'multimedia has been changed'})
                        .expect(200)
                        .end(function(err,res){
                            res.statusCode.should.equal(200);
                            var resObj = JSON.parse(res.text);
                            should.exist(resObj.mmid);
                            Multimedia.findOne({id:mmid}).exec(function(err,mm){
                                should.exist(mm);
                                mm.title.should.equal('editedmultimedia16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPhdd');
                                callback(null);
                            });

                        });
                }
            ],function(err, results){
                done();
            });
        });

        it('should add new tags to multimedia', function(done){
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback(null);
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            accessToken=resObj.token;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/multimedia/save/'+mmid+'?access_token='+accessToken)
                        .send({tags:'ted, talk, save, test',title:'editedmultimedia16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPhdd', description:'multimedia has been changed'})
                        .expect(200)
                        .end(function(err,res){
                            res.statusCode.should.equal(200);
                            var resObj = JSON.parse(res.text);
                            should.exist(resObj.mmid);
                            Multimedia.findOne({id:mmid}).populate('tags').exec(function(err,mm){
                                should.exist(mm);
                                mm.title.should.equal('editedmultimedia16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPhdd');
                                mm.tags.length.should.equal(4);
                                var tags = mm.tags.map(function(tag){
                                    return tag.text;
                                });
                                _.indexOf(tags,'ok').should.equal(-1);
                                _.indexOf(tags,'save').should.not.equal(-1)
                                callback(null);
                            });

                        });
                }
            ],function(err, results){
                done();
            });
        });

        it('should successfully reduce tags to multimedia', function(done){
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback(null);
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            accessToken=resObj.token;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/multimedia/save/'+mmid2+'?access_token='+accessToken)
                        .send({tags:'NLP,sentimental,baseline algorithm'})
                        .expect(200)
                        .end(function(err,res){
                            res.statusCode.should.equal(200);
                            var resObj = JSON.parse(res.text);
                            should.exist(resObj.mmid);
                            Multimedia.findOne({id:mmid2}).populate('tags').exec(function(err,mm){
                                should.exist(mm);
                                mm.tags.length.should.equal(3);
                                var tags = mm.tags.map(function(tag){
                                    return tag.text;
                                });
                                _.indexOf(tags,'analysis').should.equal(-1);
                                _.indexOf(tags,'NLP').should.not.equal(-1)
                                callback(null);
                            });

                        });
                }
            ],function(err, results){
                done();
            });
        });

        it('should not be permitted to edit multimedia', function(done){
            var agent = request.agent(sails.hooks.http.app);
            async.waterfall([
                function(callback){
                    agent
                        .post('/auth/login')
                        .send({email: 'teststatic2@synote.com', password: 'hellowaterlock'})
                        .expect(200)
                        .end(function(err, res){
                            callback(null);
                        })
                },
                function(callback){
                    agent
                        .get('/user/jwt')
                        .expect(200)
                        .end(function(err, res){
                            var resObj = JSON.parse(res.text);
                            resObj.should.have.property("token");
                            accessToken=resObj.token;
                            callback(null);
                        });
                },
                function(callback){
                    agent
                        .post('/multimedia/save/'+mmid+'?access_token='+accessToken)
                        .send({title:'multimedia16sXUak6SvC2AEZ6bXdfwAoVgUPSXxPPhdduu', description:'Multimedia has been changed by some other users.'})
                        .expect(403)
                        .end(function(err,res){
                            res.statusCode.should.equal(403);
                            callback(null);
                        })
                }
            ],function(err, results){
                done();
            });
        });
    });

});
